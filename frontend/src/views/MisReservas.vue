<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="12">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>Mis Reservas</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" variant="text" @click="$router.push('/realizar-reserva')">
              Nueva Reserva
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <!-- Loading -->
            <div v-if="reservasStore.estaLoading" class="text-center pa-4">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="mt-2">Cargando reservas...</p>
            </div>

            <!-- Sin reservas -->
            <div v-else-if="reservasStore.obtenerReservas.length === 0" class="text-center pa-4">
              <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
              <h3 class="mt-2">No tienes reservas</h3>
              <p class="text-grey">Crea tu primera reserva para comenzar</p>
              <v-btn color="primary" class="mt-2" @click="$router.push('/realizar-reserva')">
                Crear Reserva
              </v-btn>
            </div>

            <!-- Lista de reservas -->
            <div v-else>
              <v-row>
                <v-col
                  v-for="reserva in reservasStore.obtenerReservas"
                  :key="reserva.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card
                    :color="getCardColor(reserva.estado)"
                    variant="outlined"
                    class="reserva-card"
                  >
                    <v-card-title class="d-flex justify-space-between align-center">
                      <span>Reserva #{{ reserva.id }}</span>
                      <v-chip :color="getChipColor(reserva.estado)" size="small" variant="flat">
                        {{ reserva.estado ? reserva.estado.toUpperCase() : ''}}
                      </v-chip>
                    </v-card-title>

                    <v-card-text>
                      <!-- Información básica -->
                      <div class="mb-3">
                        <v-icon small class="mr-2">mdi-calendar</v-icon>
                        <strong>{{ formatearFecha(reserva.fecha) }}</strong>
                      </div>

                      <div class="mb-3">
                        <v-icon small class="mr-2">mdi-clock</v-icon>
                        <strong>{{ reserva.hora }}</strong>
                      </div>

                      <div class="mb-3">
                        <v-icon small class="mr-2">mdi-car</v-icon>
                        {{ reserva.placa }} - {{ reserva.color }} {{ reserva.modelo }}
                      </div>

                      <div class="mb-3">
                        <v-icon small class="mr-2">mdi-wrench</v-icon>
                        {{ formatearTipoServicio(reserva.tipo_servicio) }}
                      </div>

                      <!-- Detalles de servicios -->
                      <v-divider class="my-2"></v-divider>

                      <!-- Autolavado -->
                      <div v-if="tieneAutolavado(reserva)" class="mb-2">
                        <h4 class="text-subtitle-2 primary--text">Autolavado:</h4>
                        <div class="pl-4">
                          <div v-if="reserva.lavado_exterior" class="text-caption">
                            ✓ Lavado Exterior
                          </div>
                          <div v-if="reserva.lavado_interior" class="text-caption">
                            ✓ Lavado Interior
                          </div>
                          <div v-if="reserva.encerado" class="text-caption">✓ Encerado</div>
                          <div v-if="reserva.aspirado" class="text-caption">✓ Aspirado</div>
                          <div v-if="reserva.limpieza_llantas" class="text-caption">
                            ✓ Limpieza de Llantas
                          </div>
                          <div v-if="reserva.aromatizante" class="text-caption">✓ Aromatizante</div>
                          <div class="text-caption font-weight-bold">
                            Subtotal: ${{ reserva.subtotal_autolavado || 0 }}
                          </div>
                        </div>
                      </div>

                      <!-- Estacionamiento -->
                      <div v-if="tieneEstacionamiento(reserva)" class="mb-2">
                        <h4 class="text-subtitle-2 primary--text">Estacionamiento:</h4>
                        <div class="pl-4">
                          <div class="text-caption">
                            {{
                              reserva.tipo_tarifa === 'tiempo_completo'
                                ? 'Tiempo Completo'
                                : `Por Hora (${reserva.horas_estimadas}h)`
                            }}
                          </div>
                          <div v-if="reserva.hora_salida" class="text-caption">
                            Salida estimada: {{ reserva.hora_salida }}
                          </div>
                          <div class="text-caption font-weight-bold">
                            Subtotal: ${{ reserva.subtotal_estacionamiento || 0 }}
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-2"></v-divider>

                      <!-- Total -->
                      <div class="text-h6 text-center primary--text font-weight-bold">
                        Total: ${{ reserva.total }}
                      </div>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <!-- Botones según el estado -->
                      <div v-if="reserva.estado === 'pendiente'">
                        <v-btn
                          color="error"
                          variant="text"
                          size="small"
                          @click="cambiarEstado(reserva.id, 'cancelada')"
                          :loading="reservasStore.estaLoading"
                        >
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="success"
                          variant="text"
                          size="small"
                          @click="cambiarEstado(reserva.id, 'confirmada')"
                          :loading="reservasStore.estaLoading"
                        >
                          Confirmar
                        </v-btn>
                      </div>

                      <div v-else-if="reserva.estado === 'confirmada'">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          @click="cambiarEstado(reserva.id, 'completada')"
                          :loading="reservasStore.estaLoading"
                        >
                          Marcar Completada
                        </v-btn>
                      </div>

                      <v-btn
                        v-if="['cancelada', 'completada'].includes(reserva.estado)"
                        color="error"
                        variant="text"
                        size="small"
                        @click="eliminarReserva(reserva.id)"
                        :loading="reservasStore.estaLoading"
                      >
                        Eliminar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>

    <!-- Dialog de confirmación -->
    <v-dialog v-model="dialogConfirmacion" max-width="400">
      <v-card>
        <v-card-title>Confirmar Acción</v-card-title>
        <v-card-text>
          {{ mensajeConfirmacion }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogConfirmacion = false"> Cancelar </v-btn>
          <v-btn color="primary" @click="confirmarAccion"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReservasStore } from '@/stores/reservas'

const reservasStore = useReservasStore()

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const dialogConfirmacion = ref(false)
const mensajeConfirmacion = ref('')
const accionPendiente = ref(null)

// Métodos para UI
const mostrarMensaje = (mensaje, color = 'success') => {
  snackbar.value = {
    show: true,
    message: mensaje,
    color,
  }
}

const getCardColor = (estado) => {
  if (!estado) return 'grey lighten-3'
  if (estado === 'pendiente') return 'yellow lighten-4'
  if (estado === 'confirmada') return 'green lighten-4'
  if (estado === 'cancelada') return 'red lighten-4'
  return 'grey lighten-3'
}

const getChipColor = (estado) => {
  if (!estado) return 'grey'
  if (estado === 'pendiente') return 'yellow'
  if (estado === 'confirmada') return 'green'
  if (estado === 'cancelada') return 'red'
  return 'grey'
}

const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha + 'T00:00:00')
  return fechaObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatearTipoServicio = (tipo) => {
  switch (tipo) {
    case 'autolavado':
      return 'Autolavado'
    case 'estacionamiento':
      return 'Estacionamiento'
    case 'ambos':
      return 'Autolavado + Estacionamiento'
    default:
      return tipo
  }
}

const tieneAutolavado = (reserva) => {
  return reserva.tipo_servicio === 'autolavado' || reserva.tipo_servicio === 'ambos'
}

const tieneEstacionamiento = (reserva) => {
  return reserva.tipo_servicio === 'estacionamiento' || reserva.tipo_servicio === 'ambos'
}

// Métodos de acción
const cambiarEstado = (reservaId, nuevoEstado) => {
  const mensajes = {
    confirmada: '¿Confirmar esta reserva?',
    completada: '¿Marcar esta reserva como completada?',
    cancelada: '¿Cancelar esta reserva?',
  }

  mensajeConfirmacion.value = mensajes[nuevoEstado]
  accionPendiente.value = () => ejecutarCambioEstado(reservaId, nuevoEstado)
  dialogConfirmacion.value = true
}

const ejecutarCambioEstado = async (reservaId, nuevoEstado) => {
  try {
    await reservasStore.actualizarEstado(reservaId, nuevoEstado)
    mostrarMensaje(`Reserva ${nuevoEstado} exitosamente`)
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    mostrarMensaje('Error al cambiar el estado de la reserva', 'error')
  }
}

const eliminarReserva = (reservaId) => {
  mensajeConfirmacion.value = '¿Eliminar esta reserva permanentemente?'
  accionPendiente.value = () => ejecutarEliminacion(reservaId)
  dialogConfirmacion.value = true
}

const ejecutarEliminacion = async (reservaId) => {
  try {
    await reservasStore.eliminarReserva(reservaId)
    mostrarMensaje('Reserva eliminada exitosamente')
  } catch (error) {
    console.error('Error al eliminar reserva:', error)
    mostrarMensaje('Error al eliminar la reserva', 'error')
  }
}

const confirmarAccion = () => {
  if (accionPendiente.value) {
    accionPendiente.value()
    accionPendiente.value = null
  }
  dialogConfirmacion.value = false
}

// Inicialización
onMounted(async () => {
  try {
    await reservasStore.cargarReservas()
  } catch (error) {
    console.error('Error al cargar reservas:', error)
    mostrarMensaje('Error al cargar las reservas', 'error')
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
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

/* Tarjeta principal con glassmorphism y mejor contraste */
.v-card {
  border-radius: 28px !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow:
    0 25px 45px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  color: #1a1a1a !important; /* Texto más oscuro */
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
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
}

/* Toolbar elegante */
.v-toolbar {
  background: linear-gradient(135deg, #1e3c72, #2a5298, #4a90e2) !important;
  background-size: 300% 300% !important;
  animation: toolbarGradient 6s ease infinite;
  color: white !important;
  border-top-left-radius: 28px !important;
  border-top-right-radius: 28px !important;
  height: 80px !important;
  padding: 0 32px !important;
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
  font-size: 26px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  color: white !important;
}

/* Tarjetas de reserva con efectos premium y mejor contraste */
.reserva-card {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
  color: #1a1a1a !important; /* Texto más oscuro */
}

.reserva-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1e3c72, #2a5298, #4a90e2);
}

.reserva-card:hover {
  transform: translateY(-8px) scale(1.03) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(30, 60, 114, 0.3) !important;
}

/* Estados de tarjetas con gradientes y mejor contraste */
.reserva-card[data-color='orange-lighten-5'] {
  background: linear-gradient(135deg, rgba(255, 183, 77, 0.2), rgba(255, 193, 7, 0.1)) !important;
  border-left: 4px solid #ff9800 !important;
  color: #2d2d2d !important;
}

.reserva-card[data-color='blue-lighten-5'] {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(30, 136, 229, 0.1)) !important;
  border-left: 4px solid #2196f3 !important;
  color: #1a1a1a !important;
}

.reserva-card[data-color='green-lighten-5'] {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(67, 160, 71, 0.1)) !important;
  border-left: 4px solid #4caf50 !important;
  color: #1a1a1a !important;
}

.reserva-card[data-color='red-lighten-5'] {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(229, 57, 53, 0.1)) !important;
  border-left: 4px solid #f44336 !important;
  color: #1a1a1a !important;
}

/* Botones elegantes con mejor contraste */
.v-btn {
  border-radius: 16px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  padding: 12px 24px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: none !important;
  letter-spacing: 0.4px;
  position: relative;
  overflow: hidden;
  color: white !important; /* Texto blanco por defecto */
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
  transform: translateY(-2px) scale(1.05) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Botones de colores específicos */
.v-btn[color='primary'] {
  background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
  color: white !important;
  box-shadow: 0 6px 15px rgba(30, 60, 114, 0.3) !important;
}

.v-btn[color='success'] {
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
  color: white !important;
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.3) !important;
}

.v-btn[color='error'] {
  background: linear-gradient(135deg, #f44336, #ef5350) !important;
  color: white !important;
  box-shadow: 0 6px 15px rgba(244, 67, 54, 0.3) !important;
}

.v-btn[color='warning'] {
  background: linear-gradient(135deg, #ff9800, #ffb74d) !important;
  color: white !important;
  box-shadow: 0 6px 15px rgba(255, 152, 0, 0.3) !important;
}

.v-btn[color='white'] {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #1e3c72 !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2) !important;
  font-weight: 700 !important;
}

/* Chips elegantes con mejor contraste */
.v-chip {
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  padding: 8px 16px !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
  color: white !important;
}

.v-chip:hover {
  transform: scale(1.05);
}

/* Iconos con efectos */
.v-icon {
  transition: all 0.2s ease !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.v-icon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* Texto principal con mejor contraste */
.primary--text {
  color: #1e3c72 !important;
  font-weight: 600 !important;
}

/* Títulos y texto general */
.v-card-title {
  color: #1a1a1a !important;
  font-weight: 600 !important;
  font-size: 1.2rem !important;
}

.v-card-text {
  color: #2d2d2d !important;
  font-size: 0.95rem !important;
  line-height: 1.5 !important;
}

.v-card-text p {
  color: #2d2d2d !important;
  margin-bottom: 8px !important;
}

/* Subtítulos y texto secundario */
.text-subtitle-1 {
  color: #1a1a1a !important;
  font-weight: 600 !important;
}

.text-subtitle-2 {
  color: #2d2d2d !important;
  font-weight: 600 !important;
  letter-spacing: 0.2px;
}

.text-caption {
  color: #424242 !important;
  font-weight: 500 !important;
}

.text-body-2 {
  color: #2d2d2d !important;
  font-weight: 400 !important;
}

/* Totales y precios */
.v-card-text h3,
.v-card-text h4 {
  color: #1e3c72 !important;
  font-weight: 700 !important;
  font-size: 1.3rem !important;
}

/* Progress circular */
.v-progress-circular {
  filter: drop-shadow(0 4px 8px rgba(30, 60, 114, 0.3));
}

/* Dividers elegantes */
.v-divider {
  background: linear-gradient(90deg, transparent, rgba(30, 60, 114, 0.2), transparent) !important;
  height: 2px !important;
  border-radius: 1px;
}

/* Snackbar */
.v-snackbar {
  border-radius: 16px !important;
  backdrop-filter: blur(20px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important;
  color: white !important;
}

/* Dialog */
.v-dialog .v-card {
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2) !important;
  color: #1a1a1a !important;
}

/* Etiquetas de estado */
.status-confirmed {
  background: linear-gradient(135deg, #4caf50, #66bb6a) !important;
  color: white !important;
}

.status-pending {
  background: linear-gradient(135deg, #ff9800, #ffb74d) !important;
  color: white !important;
}

.status-cancelled {
  background: linear-gradient(135deg, #f44336, #ef5350) !important;
  color: white !important;
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

.v-col {
  animation: fadeInUp 0.6s ease-out;
}

.v-col:nth-child(even) {
  animation-delay: 0.1s;
}

.v-col:nth-child(odd) {
  animation-delay: 0.2s;
}

/* Estados de loading */
.v-progress-circular {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Efectos de hover en textos */
.v-card-title:hover {
  color: #1e3c72 !important;
  transition: color 0.2s ease;
}

.v-card-text p:hover {
  color: #1a1a1a !important;
  transition: color 0.2s ease;
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

/* Responsive improvements */
@media (max-width: 768px) {
  .v-card {
    border-radius: 20px !important;
  }

  .v-toolbar {
    height: 64px !important;
    padding: 0 20px !important;
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
  }

  .v-toolbar-title {
    font-size: 20px !important;
  }

  .reserva-card {
    border-radius: 16px !important;
  }

  .v-btn {
    padding: 10px 20px !important;
    font-size: 13px !important;
  }
}

/* Efectos adicionales para elementos vacíos */
.text-center .v-icon[size='64'] {
  opacity: 0.6;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Mejoras en la tipografía */
h1, h2, h3, h4, h5, h6 {
  color: #1a1a1a !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
}

/* Texto de párrafos */
p {
  color: #2d2d2d !important;
  line-height: 1.6 !important;
}

/* Enlaces */
a {
  color: #1e3c72 !important;
  text-decoration: none;
  font-weight: 500 !important;
}

a:hover {
  color: #2a5298 !important;
  text-decoration: underline;
}

/* Efectos de focus */
.v-btn:focus {
  outline: 2px solid rgba(30, 60, 114, 0.5);
  outline-offset: 2px;
}

/* Asegurar que el texto sea siempre legible */
.v-card *,
.reserva-card *,
.v-dialog .v-card * {
  color: inherit !important;
}

/* Texto en campos de formulario */
.v-text-field .v-input__control .v-input__slot {
  color: #1a1a1a !important;
}

.v-text-field input {
  color: #1a1a1a !important;
}

.v-text-field label {
  color: #424242 !important;
}

/* Asegurar contraste en todos los elementos de texto */
.v-application {
  color: #1a1a1a !important;
}

/* Texto en elementos específicos */
.v-list-item__title {
  color: #1a1a1a !important;
}

.v-list-item__subtitle {
  color: #2d2d2d !important;
}

.v-tab {
  color: #1a1a1a !important;
}

.v-tab--active {
  color: #1e3c72 !important;
}
</style>
