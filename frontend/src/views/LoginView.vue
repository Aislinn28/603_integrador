<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="12" class="pa-6">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{
              mostrarRegistro ? 'Registro de Usuario' : 'Iniciar Sesión'
            }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-alert v-if="mensaje" :type="tipoMensaje" dense text>
              {{ mensaje }}
            </v-alert>

            <!-- ✅ CAMPOS PARA REGISTRO -->
            <template v-if="mostrarRegistro">
              <v-text-field
                v-model="nombre"
                label="Nombre"
                prepend-icon="mdi-account"
                required
                class="mt-4"
              />
              <v-text-field
                v-model="apellidos"
                label="Apellidos"
                prepend-icon="mdi-account-multiple"
                required
              />
              <v-text-field v-model="telefono" label="Teléfono" prepend-icon="mdi-phone" required />
            </template>

            <!-- ✅ CAMPOS COMUNES -->
            <v-text-field
              v-model="usuario"
              label="Usuario"
              prepend-icon="mdi-account"
              required
              :class="mostrarRegistro ? '' : 'mt-4'"
            />
            <v-text-field
              v-model="contrasenia"
              label="Contraseña"
              type="password"
              prepend-icon="mdi-lock"
              required
            />
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <v-btn color="primary" @click="mostrarRegistro ? registrar() : login()" block>
              {{ mostrarRegistro ? 'Registrar' : 'Entrar' }}
            </v-btn>
          </v-card-actions>

          <v-card-actions class="justify-center">
            <v-btn text @click="toggleRegistro" color="primary">
              {{ mostrarRegistro ? 'Volver a Iniciar Sesión' : '¿No tienes cuenta? Regístrate' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario_store'

const router = useRouter()
const usuarioStore = useUsuarioStore()

// Variables reactivas
const usuario = ref('')
const contrasenia = ref('')
const nombre = ref('')
const apellidos = ref('')
const telefono = ref('')
const mensaje = ref('')
const tipoMensaje = ref('')
const mostrarRegistro = ref(false)

// ✅ FUNCIÓN DE REGISTRO
async function registrar() {
  mensaje.value = ''
  tipoMensaje.value = ''

  if (
    !nombre.value ||
    !apellidos.value ||
    !telefono.value ||
    !usuario.value ||
    !contrasenia.value
  ) {
    mensaje.value = 'Todos los campos son obligatorios'
    tipoMensaje.value = 'error'
    return
  }

  try {
    const payload = {
      nombre: nombre.value,
      apellidos: apellidos.value,
      telefono: telefono.value,
      usuario: usuario.value,
      contrasenia: contrasenia.value,
    }

    const resp = await usuarioStore.registrarUsuario(payload)
    mensaje.value = resp.mensaje || 'Registro exitoso'
    tipoMensaje.value = 'success'

    limpiarFormulario()
    mostrarRegistro.value = false
  } catch (error) {
    console.error('Error en registro:', error)
    mensaje.value = error.mensaje || error || 'Error en el registro'
    tipoMensaje.value = 'error'
  }
}

// ✅ FUNCIÓN DE LOGIN ACTUALIZADA
async function login() {
  mensaje.value = ''
  tipoMensaje.value = ''

  if (!usuario.value || !contrasenia.value) {
    mensaje.value = 'Usuario y contraseña son obligatorios'
    tipoMensaje.value = 'error'
    return
  }

  try {
    const payload = {
      usuario: usuario.value,
      contrasenia: contrasenia.value,
    }

    const resp = await usuarioStore.login(payload)
    mensaje.value = resp.mensaje || 'Inicio de sesión exitoso'
    tipoMensaje.value = 'success'

    // ✅ Usa el tipo de usuario real que viene del backend
    const tipo = resp.usuario?.tipo_usuario || 'usuario'
    localStorage.setItem('tipo_usuario', tipo)

    localStorage.setItem('token', resp.token)

    // 👉 Redirección según tipo
    setTimeout(() => {
      if (tipo === 'empleado') {
        router.push({ name: 'BienvenidaEmpleado' })
      } else {
        router.push({ name: 'bienvenida' })
      }
    }, 1000)
  } catch (error) {
    console.error('Error en login:', error)
    mensaje.value = error.mensaje || error || 'Error al iniciar sesión'
    tipoMensaje.value = 'error'
  }
}

function toggleRegistro() {
  mostrarRegistro.value = !mostrarRegistro.value
  limpiarFormulario()
  mensaje.value = ''
}

function limpiarFormulario() {
  usuario.value = ''
  contrasenia.value = ''
  nombre.value = ''
  apellidos.value = ''
  telefono.value = ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.fill-height::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(30, 60, 114, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(42, 82, 152, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Tarjeta principal con efecto glassmorphism */
.v-card {
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 45px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.v-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.v-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 35px 60px rgba(0, 0, 0, 0.15),
    0 15px 25px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* Barra superior con gradiente dinámico */
.v-toolbar {
  background: linear-gradient(135deg, #1e3c72, #2a5298, #4a90e2);
  background-size: 300% 300%;
  animation: toolbarGradient 6s ease infinite;
  color: white;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  height: 80px;
  position: relative;
  overflow: hidden;
}

.v-toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes toolbarGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.v-toolbar-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* Contenido de la tarjeta */
.v-card-text {
  padding: 32px;
  padding-bottom: 16px;
  background: rgba(255, 255, 255, 0.02);
}

/* Campos de texto mejorados */
.v-text-field {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.v-text-field:hover {
  transform: translateY(-1px);
}

.v-text-field .v-field {
  border-radius: 16px;
  background: rgba(30, 60, 114, 0.02);
  border: 1px solid rgba(30, 60, 114, 0.1);
  transition: all 0.3s ease;
}

.v-text-field .v-field:hover {
  border-color: rgba(30, 60, 114, 0.2);
  box-shadow: 0 4px 8px rgba(30, 60, 114, 0.1);
}

.v-text-field .v-field--focused {
  border-color: #2a5298;
  box-shadow: 0 0 0 2px rgba(42, 82, 152, 0.2);
}

.v-text-field .v-field__input {
  font-weight: 500;
  color: #2d3748;
}

.v-text-field .v-field__prepend-inner {
  color: #2a5298;
  transition: all 0.3s ease;
}

.v-text-field:hover .v-field__prepend-inner {
  transform: scale(1.1);
}

/* Botones con efectos avanzados */
.v-btn {
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.4px;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  min-height: 48px;
}

.v-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.v-btn:hover::before {
  left: 100%;
}

.v-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 25px rgba(30, 60, 114, 0.3);
}

.v-btn:active {
  transform: translateY(0) scale(0.98);
}

/* Botón principal */
.v-btn.v-btn--variant-elevated {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: #fff !important;
  box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3);
}

.v-btn.v-btn--variant-elevated:hover {
  background: linear-gradient(135deg, #2a5298, #4a90e2);
  box-shadow: 0 12px 30px rgba(30, 60, 114, 0.4);
}

/* Botón de texto */
.v-btn--variant-text {
  color: #2a5298 !important;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.v-btn--variant-text:hover {
  background: rgba(30, 60, 114, 0.05);
  transform: translateY(-1px);
}

/* Alertas mejoradas */
.v-alert {
  margin-bottom: 20px;
  font-size: 14px;
  border-radius: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-alert--variant-text {
  background: rgba(255, 255, 255, 0.1);
}

.v-alert.v-alert--type-error {
  background: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border-color: rgba(244, 67, 54, 0.2);
}

.v-alert.v-alert--type-success {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border-color: rgba(76, 175, 80, 0.2);
}

/* Acciones de la tarjeta */
.v-card-actions {
  padding: 20px 32px;
  gap: 16px;
}

.v-card-actions .v-btn {
  flex: 1;
}

.v-card-actions.justify-center {
  padding-top: 8px;
  padding-bottom: 24px;
}

/* Animaciones de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-text-field {
  animation: fadeInUp 0.6s ease forwards;
}

.v-text-field:nth-child(1) {
  animation-delay: 0.1s;
}
.v-text-field:nth-child(2) {
  animation-delay: 0.2s;
}
.v-text-field:nth-child(3) {
  animation-delay: 0.3s;
}
.v-text-field:nth-child(4) {
  animation-delay: 0.4s;
}
.v-text-field:nth-child(5) {
  animation-delay: 0.5s;
}

/* Efectos de micro-interacciones */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive enhancements */
@media (max-width: 768px) {
  .v-card {
    border-radius: 20px;
    margin: 16px;
  }

  .v-toolbar {
    height: 64px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .v-toolbar-title {
    font-size: 18px;
  }

  .v-card-text {
    padding: 24px;
  }

  .v-btn {
    padding: 14px 24px;
    font-size: 15px;
    min-height: 44px;
  }

  .v-card-actions {
    padding: 16px 24px;
  }
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2a5298, #1e3c72);
}

/* Efectos de foco mejorados */
.v-text-field .v-field--focused .v-field__outline {
  border-color: #2a5298;
  border-width: 2px;
}

.v-text-field .v-field--focused .v-field__prepend-inner {
  color: #1e3c72;
}

/* Transiciones suaves para el cambio de modo */
.v-card-text > * {
  transition: all 0.3s ease;
}

/* Mejoras en la tipografía */
.v-field__input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.v-label {
  color: #64748b;
  font-weight: 500;
}

.v-field--focused .v-label {
  color: #2a5298;
}
</style>
