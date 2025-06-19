import { defineStore } from 'pinia'
import { ClientesService } from '@/services'

export const useClienteStore = defineStore('cliente_store', {
  actions: {
    registrarCliente(payload) {
      return ClientesService.instance.registrarCliente(payload)
    },
  },
})
