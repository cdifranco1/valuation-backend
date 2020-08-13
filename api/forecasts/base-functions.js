
module.exports = {
  selectArrays,
  combineArrays,
  pipe,
  mapObjArr,
  mapObjArrEl,
  expand,
  truncate,
  createUpdateFunction
}


function selectArrays(obj, ...args){
  return args.map(el => {
    if (typeof el === 'string'){
      return obj[el]
    }
    return el
  })
}

//combine arrays when do not need to read original forecasts
function combineArrays(operation='SUBTRACT', ...arrays){
    return arrays.reduce((a, b) => {
      return a.map((el, i) => {
        switch (operation){
          case 'subtract':
            return el - b[i]
          case 'add':
            return el + b[i]
          case 'multiply':
            return el * b[i]
          case 'divide':
            return el / b[i]
          default:
            return el - b[i]
        }
      })
    })
  };

function pipe(operation, fn1, fn2){
  return (...args) => {

    const result1 = fn1(...args)

    const result2 = fn2(operation, ...result1)

    return result2
  }
}


function mapObjArrEl(obj, fn){
  const newObj = Object.keys(obj).reduce((a, b) => {
    if (obj[b].length){
      a[b] = obj[b].map(fn)
      return a 
    }

    a[b] = fn(obj[b]) 
    return a 

  }, {})
  return newObj
}

function expand (arr, pd, expandVal) {
  const length = arr.length
  const mergeArr = Array.from({length: (pd - length)}, () => expandVal)

  return [...arr, ...mergeArr]
}

function truncate(arr, pd) {
  return arr.filter((el, i) => (i < pd))
}

function mapObjArr(obj, fn, ...args){
  const newObj = Object.keys(obj).reduce((a, b) => {
    a[b] = fn(obj[b], ...args)
    return a
  }, {})

  return newObj
}

function createUpdateFunction(obj){
  return (fn, ...args) => {
    return mapObjArr(obj, fn, ...args)
  }
}
