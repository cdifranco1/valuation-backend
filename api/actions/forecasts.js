const utils = require('./utils')
const moment = require('moment')


const inputs = {
  forecasts:{
    revenues: [100, 200, 300, 400, 500],
    cogs: [30, 40, 50, 60, 70],
    opex: [50, 50, 50 , 50, 50],
    nwcChange: [20, 35, 40, 45, 50],
    depreciation: [20, 35, 40, 45, 50],
    amortization: [20, 35, 40, 45, 50],
    capex: [10, 10, 10, 10, 10]
  },
  genInputs: {
    periods: 5,
    valDate: '2019-10-01',
    fye: '2019-12-31'
  },
  valAssumps: {
    wacc: '13',
    taxRate: '25',
    ltgr: '3'
  }
}

// Functions to read from and build forecast calc arrays
const subtractLineItems = utils.pipe('subtract', utils.selectArrays, utils.combineArrays) 
const addLineItems = utils.pipe('add', utils.selectArrays, utils.combineArrays)


//convert to cents before processing
function prepForecasts(inputObj){
  const { forecasts } = inputObj
  const { periods } = inputObj.genInputs
  
  //expand forecasts
  const updateForecasts = utils.createUpdateFunction(forecasts)
  const expandedForecasts = updateForecasts(utils.expand, periods, 0) 

  //truncate forecasts
  const truncateExpandedForecasts = utils.createUpdateFunction(expandedForecasts)
  const truncatedForecasts = truncateExpandedForecasts(utils.truncate, periods)

  const preppedForecasts = utils.mapObjArrEl(truncatedForecasts, (el) => el * 100)
 
 return {
   ...inputObj,
   forecasts: {
    ...preppedForecasts 
   }
 }
}

// function grossProfit(revenues, cogs){
//   return revenues - cogs
// }

// function ebitda(grossProfit, opex){
//   return grossProfit - opex
// }

// function ebit(ebitda, depreciation, amortization){
//   return ebitda - depreciation - amortization
// }

// function taxes(ebit, taxRate){
//   if (ebit <= 0){
//     return 0
//   }

//   return ebit * taxRate
// }

// function getLineItemArrays(forecastObject, ...lineItems){
//   const returnObject = {}

//   lineItems.forEach(el => returnObject[el] = forecastObject[el])

//   return returnObject
// }

// function calcLineItem(lineItemArray, calcFunction, forecasts){
//   getLineItemArrays(forecasts)
// }


function buildForecasts(inputObj){
  const { forecasts, valAssumps, genInputs } = inputObj

  const gp = subtractLineItems(forecasts, 'revenues', 'cogs')
  const ebitda = subtractLineItems(forecasts, gp, 'opex')
  const ebit = subtractLineItems(forecasts, ebitda, 'depreciation', 'amortization')
  const taxes = ebit.map(el => el < 0 ? 0 : el * valAssumps.taxRate / 100)
   

  const nopat = utils.combineArrays('subtract', ebit, taxes)
  const fcf = utils.combineArrays('subtract', addLineItems(forecasts, nopat, 'depreciation', 'amortization'), addLineItems(forecasts, 'capex', 'nwcChange'))

  const partialPeriods = calcPartialPeriods(genInputs.fye, genInputs.valDate, genInputs.periods)
  const discountPeriods = calcDiscountPeriods(genInputs.periods, partialPeriods[0])
  const pvFactors = calcPVFactors(valAssumps.wacc, genInputs.periods, discountPeriods)

  const dcf = utils.combineArrays('multiply', fcf, partialPeriods, pvFactors)

  return {
    forecasts: {
      ...forecasts,
      gp: [...gp],
      ebitda: [...ebitda],
      ebit: [...ebit],
      taxes: [...taxes],
      nopat: [...nopat],
      fcf: [...fcf],
      dcf: [...dcf],
    },
    discounting: {
      discountPeriods: [...discountPeriods],
      pvFactors: [...pvFactors],
      partialPeriods: [...partialPeriods]
    }
  }
}


// discounting calculations
function calcPartialPeriods(fye, valDate, periods){
  const partialPeriods = []

  const days = 365.25
  const a = moment(fye)
  const b = moment(valDate)
  let PP = a.diff(b, 'days') / days
  
  
  for (let i = 0; i < periods; i++){
    if (i === 0){
      partialPeriods.push(PP)
    } else {
      partialPeriods.push(1)
    }
  }

  return partialPeriods
}


function calcDiscountPeriods(periods, partialPeriod){
  const discountPeriods = []
  
  for (let i = 0; i < periods; i++){
    if (i === 0){
      discountPeriods.push(partialPeriod / 2)
    } else if (i === 1){
      discountPeriods.push(discountPeriods[0] * 2 + 0.5)
    } else {
      discountPeriods.push(discountPeriods[i - 1] + 1)
    }
  }

  return discountPeriods
}

function calcPVFactors(wacc, periods, discountPeriods){
  const pvFactors = []

  const discountFactor = 1 + Number(wacc / 100)

  for (let i = 0; i < periods; i++){
    pvFactors.push(1 / Math.pow(discountFactor, discountPeriods[i]))
  }
  
  return pvFactors
}


function calcBEV(dcf, TV){
  const discretePeriod = dcf.reduce((a, b) => a + b)
  const BEV = discretePeriod + TV

  return {
    discretePV: discretePeriod,
    consolidated: BEV
  }
}

function calcTV(fcf, wacc, ltgr, pvFactors){
  const terminalCF = fcf[fcf.length - 1] * (1 + ltgr / 100)
  const terminalFactor = (1 / (wacc / 100 - ltgr / 100))
  const terminalValue = (terminalCF * terminalFactor)
  const pvFactor = pvFactors[pvFactors.length - 1]
  const discountedTV = terminalValue * pvFactor

  return {
    values: {
      terminalCF: terminalCF,
      preDiscountTV: terminalValue,
      discountedTV: discountedTV
    },
    pvFactor: pvFactor,
    terminalFactor: terminalFactor
  }
}

function valuation(fcf, dcf, wacc, ltgr, pvFactors){
  const TV = calcTV(fcf, wacc, ltgr, pvFactors)
  const { discountedTV } = TV.values

  const BEV = calcBEV(dcf, discountedTV)

  return {
    TV: TV,
    BEV: BEV
  }
}

function process(inputs){
  const { userId } = inputs
  const { wacc, ltgr } = inputs.valAssumps

  const preppedForecasts = prepForecasts(inputs)
  
  const forecastCalcs = buildForecasts(preppedForecasts)
  
  const { fcf, dcf } = forecastCalcs.forecasts
  const { pvFactors } = forecastCalcs.discounting

  const { BEV, TV } = valuation(fcf, dcf, wacc, ltgr, pvFactors)

  const dollarBEV = utils.mapObjArrEl(BEV, (el) => el / 100)
  const dollarTV = utils.mapObjArrEl(TV.values, (el) => el / 100)
  const dollarForecasts = utils.mapObjArrEl(forecastCalcs.forecasts, (el) => el / 100)

  const consolidated = {
    userId: userId,
    forecasts: {
      ...dollarForecasts
    },
    discounting: {
      ...forecastCalcs.discounting
    },
    BEV: {
      ...dollarBEV
    },
    TV: {
      ...TV,
      values: {
        ...dollarTV
      },
    },
    valAssumps: {
      ...inputs.valAssumps
    },
    genInputs: {
      ...inputs.genInputs
    }
  }

  return consolidated
}



module.exports = process

