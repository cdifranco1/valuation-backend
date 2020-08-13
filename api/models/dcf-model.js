const mongoose = require('mongoose')

function validateLength(arr){
  return arr.length === this.genInputs.periods
}

const arrValidatorMsg = "Each forecast should have at least one value."

const DCF = mongoose.model('DCF', new mongoose.Schema({
  //userId doesn't need to be reference ID because Amplify auth
  userId: {
    type: String,
    required: true
  },
  forecasts: {
    revenues: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    cogs: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    opex: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    nwcChange: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    depreciation: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    amortization: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    capex: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    gp: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    ebitda: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    ebit: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    taxes: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    nopat: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    fcf: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    dcf: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    }
  },
  discounting: {
    discountPeriods: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    pvFactors: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    },
    partialPeriods: {
      type: [Number],
      required: true,
      validate: {
        validator: validateLength,
        message: arrValidatorMsg
      }
    }
  },
  BEV: { 
    discretePV: Number, 
    consolidated: Number 
  },
  TV: {
    values: {
      terminalCF: Number,
      preDiscountTV: Number,
      discountedTV: Number
    },
    pvFactor: Number,
    terminalFactor: Number
  },
    valAssumps: { 
      wacc: Number, 
      taxRate: Number, 
      ltgr: Number 
    },
    genInputs: { 
      projectName: String,
      entityName: String,
      valDate: String, 
      fye: String, 
      periods: Number 
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})
)


exports.DCF = DCF






// ******* TESTING TO BE DELETED ********


// const toSave = {
//   userId: "5eac6cbdcf3b38a29fa01346",
//   forecasts: {
//     revenues: [ 200, 200, 200, 200, 200 ],
//     cogs: [ 0, 0, 0, 0, 0 ],
//     opex: [ 0, 0, 0, 0, 0 ],
//     nwcChange: [ 0, 0, 0, 0, 0 ],
//     depreciation: [ 0, 0, 0, 0, 0 ],
//     amortization: [ 0, 0, 0, 0, 0 ],
//     capex: [ 0, 0, 0, 0, 0 ],
//     gp: [ 200, 200, 200, 200, 200 ],
//     ebitda: [ 200, 200, 200, 200, 200 ],
//     ebit: [ 200, 200, 200, 200, 200 ],
//     taxes: [ 0, 0, 0, 0, 0 ],
//     nopat: [ 200, 200, 200, 200, 200 ],
//     fcf: [ 200, 200, 200, 200, 200 ],
//     dcf: [ 49.828884325804246, 200, 200, 200, 200 ]
//   },
//   discounting: {
//     discountPeriods: [
//       0.12457221081451061,
//       0.7491444216290213,
//       1.7491444216290213,
//       2.7491444216290213,
//       3.7491444216290213
//     ],
//     pvFactors: [ 1, 1, 1, 1, 1 ],
//     partialPeriods: [ 0.24914442162902123, 1, 1, 1, 1 ]
//   },
//   TV: {
//     values: {
//       terminalCF: 200,
//       preDiscountTV: Infinity,
//       discountedTV: Infinity
//     },
//     pvFactor: 1,
//     terminalFactor: Infinity
//   },
//   BEV: { discretePV: 849.8288843258042, consolidated: Infinity },
//   valAssumps: { wacc: 0, taxRate: 0, ltgr: 0 },
//   genInputs: { valDate: '2019-10-01', fye: '2019-12-31', periods: 5 }
// }

// async function saveTest(model){
//   const dcf = new DCF(model)

//   const saved = await dcf.save()

//   console.log(saved)
// }

// saveTest(toSave)


 