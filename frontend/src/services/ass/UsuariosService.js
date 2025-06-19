import Http from '../http'

export default class UsuariosService extends Http {
  static _instance

  constructor() {
    super()

    if (UsuariosService._instance) {
      return UsuariosService._instance
    }

    UsuariosService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  login(payload) {
    return super.post('usuario/login', payload, false)
  }

  obtener() {
    return super.get('usuario', null, true)
  }

  registrar(payload) {
    // Aquí apuntamos a la ruta /usuario/registro para el registro
    return super.post('usuario/registro', payload, false)
  }
}
