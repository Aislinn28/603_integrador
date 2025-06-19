const isFieldEmpty = (v) => !!v || "campo requerido.";

const esNumerico = (valor) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(valor);

export {
  isFieldEmpty,
  esNumerico
}

