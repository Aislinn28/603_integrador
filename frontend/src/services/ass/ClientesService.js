import Http from '../http'

export default class ClientesService extends Http {
  static _instance

  constructor() {
    super()
    if (ClientesService._instance) {
      return ClientesService._instance
    }
    ClientesService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  registrarCliente(payload) {
    return super.post('cliente', payload, false) // sin token, registro público
  }
}
