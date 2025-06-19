import Http from '../http'

export default class ReservasService extends Http {
  static _instance

  constructor() {
    super()

    if (ReservasService._instance) {
      return ReservasService._instance
    }

    ReservasService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  // Obtener reservas del usuario logueado
  obtenerReservas() {
    console.log('🔍 Obteniendo reservas del usuario...')
    return super.get('reservas', null, true) // true = secure
  }

  // Crear nueva reserva
  crearReserva(payload) {
    console.log('📝 Creando reserva:', payload)
    return super.post('reservas/crear', payload, true) // true = secure
  }

  // Actualizar estado de reserva
  actualizarEstadoReserva(id, estado) {
    console.log(`🔄 Actualizando reserva ${id} a estado: ${estado}`)
    return super.put(`reservas/${id}/estado`, { estado }, true) // true = secure
  }

  // Eliminar reserva
  eliminarReserva(id) {
    console.log(`🗑️ Eliminando reserva ${id}`)
    return super.delete(`reservas/${id}`, null, true) // true = secure
  }

  // ⚠️ MÉTODO ESPECÍFICO PARA EMPLEADOS - OBTENER RESERVAS CONFIRMADAS
  obtenerReservasConfirmadas() {
    console.log('👔 Empleado obteniendo reservas confirmadas...')
    return super.get('reservas/confirmadas', null, true) // true = secure
  }
}
