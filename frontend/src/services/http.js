import axios from 'axios'
import { OK, NO_DATA } from '@/utilities/constantes'
import { existePropiedad } from '@/utilities/objetos'
import { obtenerSesion, verificarSesion } from '@/seguridad/sesion'
import ENV from './config/env'

export default class Http {
  constructor() {
    this.apiUrl = ENV.API
  }

  handlePromise(promise) {
    return promise
      .then((response) => {
        console.log('✅ Respuesta exitosa:', response.data)

        if (!response) return Promise.resolve(NO_DATA)
        let data = response.data

        if (typeof data == 'string' || data instanceof Array) {
          return Promise.resolve(data)
        }

        if (typeof data == 'object') {
          let obj = ['id']
          let modo = obj.some((item) => existePropiedad(data, item)) ? 1 : 0

          if (modo == 0) {
            return Promise.resolve(existePropiedad(data, 'mensaje') ? data.mensaje : data)
          }
          return Promise.resolve(data)
        }
        return Promise.resolve(OK)
      })
      .catch((error) => {
        console.error('❌ HTTP Error:', error.response?.data || error.message)
        console.error('❌ Status:', error.response?.status)
        console.error('❌ Error completo:', error)

        if (error.response) {
          if (typeof error.response.data === 'object') {
            let obj = []
            let modo = obj.some((item) => existePropiedad(error.response.data, item)) ? 1 : 0
            if (modo == 1) {
              return Promise.reject(error.response.data)
            }
          }

          return Promise.reject(error.response.data.mensaje || error.response.data.message || 'Ocurrió un error!')
        }
        if (error.request) {
          return Promise.reject('Servidor fuera de línea')
        }
        return Promise.reject(error.message)
      })
      .finally(() => {})
  }

  applySecurity() {
    console.log('🔐 === APLICANDO SEGURIDAD ===')

    // DEBUG: Verificar localStorage completo
    console.log('🔍 Contenido completo de localStorage:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      console.log(`  ${key}: ${value}`)
    }

    // Obtener datos de diferentes fuentes
    const sesion = obtenerSesion()
    const usuarioId = localStorage.getItem('usuario_id')
    const token = localStorage.getItem('token')

    console.log('📋 Sesión obtenida:', sesion)
    console.log('👤 Usuario ID localStorage:', usuarioId)
    console.log('🎫 Token localStorage:', token)
    console.log('🎫 Token existe?', !!token)
    console.log('🎫 Token length:', token ? token.length : 'N/A')
    console.log('✅ Verificar sesión:', verificarSesion())

    // Limpiar headers anteriores
    delete axios.defaults.headers.common['usuario_id']
    delete axios.defaults.headers.common['Authorization']

    if (token) {
      // Configurar Authorization header con el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('✅ Header Authorization configurado')
    } else {
      console.log('❌ No hay token en localStorage')
      return false
    }

    // DEBUG: Verificar headers finales
    console.log('🚀 Headers finales de axios:', {
      'Authorization': axios.defaults.headers.common['Authorization'],
      'Content-Type': axios.defaults.headers.common['Content-Type']
    })

    return true
  }

  get(url, params = null, secure = false) {
    if (secure) {
      const securityApplied = this.applySecurity()
      if (!securityApplied) {
        return Promise.reject('No se pudo aplicar la seguridad. Token no disponible.')
      }
    }

    console.log(`🌐 GET a ${this.apiUrl}${url}`)
    console.log('🔐 Secure:', secure)

    if (!params) {
      return this.handlePromise(axios.get(`${this.apiUrl}${url}`))
    } else {
      return this.handlePromise(axios.get(`${this.apiUrl}${url}`, { params: params }))
    }
  }

  post(url, payload, secure = false, config = {}) {
    if (secure) {
      const securityApplied = this.applySecurity()
      if (!securityApplied) {
        return Promise.reject('No se pudo aplicar la seguridad. Token no disponible.')
      }
    }

    if (!payload) {
      return Promise.reject('Payload requerido')
    }

    console.log(`🚀 POST a ${this.apiUrl}${url}`)
    console.log('📦 Payload:', payload)
    console.log('🔐 Secure:', secure)
    console.log('📋 Headers antes del envío:', {
      'Authorization': axios.defaults.headers.common['Authorization'] || 'NO CONFIGURADO',
      'Content-Type': axios.defaults.headers.common['Content-Type'] || 'default'
    })

    return this.handlePromise(axios.post(`${this.apiUrl}${url}`, payload, config))
  }

  put(url, payload, secure = false) {
    if (secure) {
      const securityApplied = this.applySecurity()
      if (!securityApplied) {
        return Promise.reject('No se pudo aplicar la seguridad. Token no disponible.')
      }
    }

    if (!payload) {
      return Promise.reject('Payload requerido')
    }

    console.log(`🔄 PUT a ${this.apiUrl}${url}`)
    console.log('📦 Payload:', payload)
    console.log('🔐 Secure:', secure)
    return this.handlePromise(axios.put(`${this.apiUrl}${url}`, payload))
  }

  patch(url, payload = null, secure = false) {
    if (secure) {
      const securityApplied = this.applySecurity()
      if (!securityApplied) {
        return Promise.reject('No se pudo aplicar la seguridad. Token no disponible.')
      }
    }

    console.log(`🔧 PATCH a ${this.apiUrl}${url}`)
    console.log('🔐 Secure:', secure)

    if (!payload) {
      return this.handlePromise(axios.patch(`${this.apiUrl}${url}`))
    }
    return this.handlePromise(axios.patch(`${this.apiUrl}${url}`, payload))
  }

  delete(url, payload, secure = false) {
    if (secure) {
      const securityApplied = this.applySecurity()
      if (!securityApplied) {
        return Promise.reject('No se pudo aplicar la seguridad. Token no disponible.')
      }
    }

    let urls = `${this.apiUrl}${url}/${payload}`
    console.log(`🗑️ DELETE a ${urls}`)
    console.log('🔐 Secure:', secure)
    return this.handlePromise(axios.delete(urls))
  }

  postWithFile(url, payload, secure = false) {
    if (secure) {
      const securityApplied = this.applySecurity()
      if (!securityApplied) {
        return Promise.reject('No se pudo aplicar la seguridad. Token no disponible.')
      }
    }

    console.log(`📁 POST con archivo a ${this.apiUrl}${url}`)
    console.log('🔐 Secure:', secure)

    return this.handlePromise(
      axios.post(`${this.apiUrl}${url}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Mantener Authorization si está configurado
          ...(axios.defaults.headers.common['Authorization'] && {
            'Authorization': axios.defaults.headers.common['Authorization']
          })
        },
      }),
    )
  }

  // Método helper para verificar si hay sesión activa
  hasActiveSession() {
    const token = localStorage.getItem('token')
    return !!token
  }

  // Método para limpiar la sesión
  clearSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario_id')
    delete axios.defaults.headers.common['Authorization']
    delete axios.defaults.headers.common['usuario_id']
    console.log('🧹 Sesión limpiada')
  }
}
