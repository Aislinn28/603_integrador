import Http from '../http'

export default class VehiculosService extends Http {
  static _instance

  constructor() {
    super()

    if (VehiculosService._instance) {
      return VehiculosService._instance
    }

    VehiculosService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  // Obtener vehículos del usuario logueado
  obtenerVehiculos() {
    return super.get('vehiculos', null, true)
  }

  // Registrar nuevo vehículo
  registrarVehiculo(payload) {
    return super.post('vehiculos/registro', payload, true)
  }

  // Actualizar vehículo
  actualizarVehiculo(id, payload) {
    return super.put(`vehiculos/${id}`, payload, true)
  }

  // Eliminar vehículo
  eliminarVehiculo(id) {
    return super.delete('vehiculos', id, true)
  }
}
