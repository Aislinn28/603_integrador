import { defineStore } from 'pinia'
import { VehiculosService } from '@/services'

export const useVehiculosStore = defineStore('vehiculos_store', {
  state: () => ({
    vehiculos: [],
    loading: false,
    error: null
  }),

  getters: {
    obtenerVehiculos: (state) => state.vehiculos,
    estaLoading: (state) => state.loading,
    obtenerError: (state) => state.error
  },

  actions: {
    async cargarVehiculos() {
      this.loading = true
      this.error = null

      try {
        const vehiculos = await VehiculosService.instance.obtenerVehiculos()
        this.vehiculos = vehiculos
        return Promise.resolve(vehiculos)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async registrarVehiculo(payload) {
      this.loading = true
      this.error = null

      try {
        const resultado = await VehiculosService.instance.registrarVehiculo(payload)
        // Recargar la lista después de registrar
        await this.cargarVehiculos()
        return Promise.resolve(resultado)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async actualizarVehiculo(id, payload) {
      this.loading = true
      this.error = null

      try {
        const resultado = await VehiculosService.instance.actualizarVehiculo(id, payload)
        await this.cargarVehiculos()
        return Promise.resolve(resultado)
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async eliminarVehiculo(id) {
      this.loading = true
      this.error = null

      try {
        const resultado = await VehiculosService.instance.eliminarVehiculo(id)
        await this.cargarVehiculos()
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
