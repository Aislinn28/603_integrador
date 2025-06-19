const copiarObjeto = (obj) => {
  let data = null

  try {
    if (typeof obj === 'object') {
      data = JSON.parse(JSON.stringify(obj))
    } else {
      data = JSON.parse(obj.toString())
    }
  } catch (e) {
    console.log(e)
    data = null
  }

  return data

}

const existePropiedad = (obj, prop) => {
  if (typeof obj !== 'object') return false
  return Object.hasOwn(obj, prop)
}

export {copiarObjeto, existePropiedad}

