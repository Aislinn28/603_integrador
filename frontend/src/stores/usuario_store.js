import { defineStore } from 'pinia'
import { UsuariosService } from '@/services'
import { crearSesion, eliminarSesion } from '@/seguridad/sesion'
import router from '@/router'

export const useUsuarioStore = defineStore('usuario_store', {
  state: () => ({
    usuarios: [],
    logueado: false,
    usuarioActual: null
  }),

  getters: {
    esUsuarioLogueado: (state) => state.logueado === true,
    obtenerUsuarioActual: (state) => state.usuarioActual
  },

  actions: {
    login(payload) {
      return UsuariosService.instance
        .login(payload)
        .then((data) => {
          console.log('🔍 Respuesta completa del login:', data);

          // ✅ ESTRUCTURA CORRECTA SEGÚN TU BACKEND
          const userData = {
            id: data.id, // viene directo del response
            usuario: payload.usuario,
            token: data.token,
            nombre: data.usuario?.nombre,
            apellidos: data.usuario?.apellidos,
            telefono: data.usuario?.telefono,
            tipo_usuario: data.usuario?.tipo_usuario // ⚠️ IMPORTANTE
          };

          console.log('👤 Datos del usuario procesados:', userData);

          // ✅ GUARDAR EN LOCALSTORAGE CORRECTAMENTE
          localStorage.setItem('token', userData.token);
          localStorage.setItem('usuario_id', userData.id.toString());
          localStorage.setItem('tipo_usuario', userData.tipo_usuario); // ⚠️ CRÍTICO PARA EL ROUTER
          localStorage.setItem('nombre_usuario', userData.nombre || '');

          console.log('💾 Guardado en localStorage:');
          console.log('  - token:', localStorage.getItem('token') ? 'OK' : 'ERROR');
          console.log('  - usuario_id:', localStorage.getItem('usuario_id'));
          console.log('  - tipo_usuario:', localStorage.getItem('tipo_usuario'));

          // Crear sesión
          crearSesion(userData.token, userData);

          // Actualizar el store
          this.usuarioActual = userData;
          this.logueado = true;

          console.log('✅ Usuario logueado exitosamente');

          // ✅ REDIRECCIÓN CORRECTA SEGÚN TIPO DE USUARIO
          if (userData.tipo_usuario === 'empleado') {
            console.log('🚀 Redirigiendo a bienvenida-empleado');
            router.push('/bienvenida-empleado');
          } else {
            console.log('🚀 Redirigiendo a bienvenida');
            router.push('/bienvenida');
          }

          return Promise.resolve(data);
        })
        .catch((err) => {
          console.error('❌ Error en login:', err);
          this.logueado = false;
          this.usuarioActual = null;
          return Promise.reject(err);
        });
    },

    registrarUsuario(payload) {
      return UsuariosService.instance.registrar(payload)
    },

    logout() {
      eliminarSesion();
      localStorage.removeItem('token');
      localStorage.removeItem('usuario_id');
      localStorage.removeItem('tipo_usuario'); // ⚠️ LIMPIAR TAMBIÉN
      localStorage.removeItem('nombre_usuario');
      this.logueado = false;
      this.usuarioActual = null;
      console.log('🚪 Usuario deslogueado');
      router.push('/login');
    }
  },

  persist: true,
})
