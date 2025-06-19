import { defineStore } from 'pinia'
import { ReservasService } from '@/services'

export const useReservasStore = defineStore('reservas_store', {
  state: () => ({
    reservas: [],
    loading: false,
    error: null
  }),

  getters: {
    obtenerReservas: (state) => state.reservas,
    estaLoading: (state) => state.loading,
    obtenerError: (state) => state.error
  },

  actions: {
    async cargarReservas() {
      this.loading = true
      this.error = null

      try {
        const respuesta = await ReservasService.instance.obtenerReservas()
        this.reservas = Array.isArray(respuesta) ? respuesta : (respuesta.recordset ?? [])
        return Promise.resolve(this.reservas)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async crearReserva(payload) {
      this.loading = true
      this.error = null

      try {
        const resultado = await ReservasService.instance.crearReserva(payload)
        // Recargar la lista después de crear
        await this.cargarReservas()
        return Promise.resolve(resultado)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async actualizarEstado(id, estado) {
      this.loading = true
      this.error = null

      try {
        const resultado = await ReservasService.instance.actualizarEstadoReserva(id, estado)
        await this.cargarReservas()
        return Promise.resolve(resultado)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async eliminarReserva(id) {
      this.loading = true
      this.error = null

      try {
        const resultado = await ReservasService.instance.eliminarReserva(id)
        await this.cargarReservas()
        return Promise.resolve(resultado)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  },

  persist: true
})
