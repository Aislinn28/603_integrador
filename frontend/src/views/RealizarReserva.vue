<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="12" class="pa-6">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>Realizar Reserva</v-toolbar-title>
          </v-toolbar>

          <v-form @submit.prevent="enviarReserva" ref="formReserva">
            <v-card-text>
              <!-- Información básica -->
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="reserva.fecha"
                    label="Fecha"
                    type="date"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="reserva.hora"
                    label="Hora"
                    type="time"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Selección de vehículo -->
              <v-select
                v-model="reserva.vehiculo_id"
                :items="vehiculosItems"
                item-title="text"
                item-value="value"
                label="Seleccionar Vehículo"
                :rules="[rules.required]"
                required
                :loading="vehiculosStore.estaLoading"
              ></v-select>

              <!-- Tipo de servicio -->
              <v-select
                v-model="reserva.tipo_servicio"
                :items="tiposServicio"
                label="Tipo de Servicio"
                :rules="[rules.required]"
                required
                @update:modelValue="onTipoServicioChange"
              ></v-select>

              <!-- Formulario de Autolavado -->
              <v-card v-if="mostrarAutolavado" class="mt-4" outlined>
                <v-card-title class="text-h6 primary--text">
                  Servicios de Autolavado
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="reserva.autolavado.lavado_exterior"
                        label="Lavado Exterior ($50)"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="reserva.autolavado.lavado_interior"
                        label="Lavado Interior ($40)"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="reserva.autolavado.encerado"
                        label="Encerado ($80)"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-checkbox
                        v-model="reserva.autolavado.aspirado"
                        label="Aspirado ($30)"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="reserva.autolavado.limpieza_llantas"
                        label="Limpieza de Llantas ($25)"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="reserva.autolavado.aromatizante"
                        label="Aromatizante ($15)"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-alert
                    v-if="reserva.tipo_servicio === 'autolavado' && !tieneServiciosAutolavado"
                    type="warning"
                    dense
                  >
                    Debe seleccionar al menos un servicio de autolavado
                  </v-alert>
                </v-card-text>
              </v-card>

              <!-- Formulario de Estacionamiento -->
              <v-card v-if="mostrarEstacionamiento" class="mt-4" outlined>
                <v-card-title class="text-h6 primary--text">
                  Servicios de Estacionamiento
                </v-card-title>
                <v-card-text>
                  <v-radio-group
                    v-model="reserva.estacionamiento.tipo_tarifa"
                    :rules="estacionamientoRules"
                  >
                    <v-radio
                      label="Por Hora ($15/hora)"
                      value="por_hora"
                    ></v-radio>
                    <v-radio
                      label="Tiempo Completo ($100)"
                      value="tiempo_completo"
                    ></v-radio>
                  </v-radio-group>

                  <!-- Campos adicionales para tarifa por hora -->
                  <div v-if="reserva.estacionamiento.tipo_tarifa === 'por_hora'">
                    <v-text-field
                      v-model.number="reserva.estacionamiento.horas_estimadas"
                      label="Horas Estimadas"
                      type="number"
                      min="1"
                      max="24"
                      :rules="[rules.required, rules.minHoras]"
                    ></v-text-field>
                    <v-text-field
                      v-model="reserva.estacionamiento.hora_salida"
                      label="Hora de Salida Estimada"
                      type="time"
                    ></v-text-field>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Resumen de precios -->
              <v-card v-if="mostrarResumen" class="mt-4" color="grey-lighten-4">
                <v-card-title class="text-h6">Resumen de Costos</v-card-title>
                <v-card-text>
                  <div v-if="mostrarAutolavado">
                    <strong>Autolavado: ${{ calcularSubtotalAutolavado }}</strong>
                    <div class="text-caption">
                      <div v-for="(servicio, key) in serviciosAutolavadoSeleccionados" :key="key">
                        {{ servicio.nombre }}: ${{ servicio.precio }}
                      </div>
                    </div>
                  </div>

                  <div v-if="mostrarEstacionamiento" class="mt-2">
                    <strong>Estacionamiento: ${{ calcularSubtotalEstacionamiento }}</strong>
                    <div class="text-caption">
                      {{ reserva.estacionamiento.tipo_tarifa === 'tiempo_completo'
                         ? 'Tiempo completo'
                         : `${reserva.estacionamiento.horas_estimadas || 0} hora(s)` }}
                    </div>
                  </div>

                  <v-divider class="my-2"></v-divider>
                  <div class="text-h6 primary--text">
                    <strong>Total: ${{ calcularTotal }}</strong>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey"
                variant="text"
                @click="$router.push('/bienvenida')"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="reservasStore.estaLoading"
                :disabled="!formularioValido"
              >
                Crear Reserva
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para mensajes -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVehiculosStore } from '@/stores/vehiculos'
import { useReservasStore } from '@/stores/reservas'

const router = useRouter()
const vehiculosStore = useVehiculosStore()
const reservasStore = useReservasStore()

const formReserva = ref(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Datos del formulario
const reserva = ref({
  fecha: '',
  hora: '',
  vehiculo_id: null,
  tipo_servicio: '',
  autolavado: {
    lavado_exterior: false,
    lavado_interior: false,
    encerado: false,
    aspirado: false,
    limpieza_llantas: false,
    aromatizante: false
  },
  estacionamiento: {
    tipo_tarifa: '',
    horas_estimadas: 1,
    hora_salida: ''
  }
})

// Opciones para selects
const tiposServicio = [
  { title: 'Autolavado', value: 'autolavado' },
  { title: 'Estacionamiento', value: 'estacionamiento' },
  { title: 'Ambos Servicios', value: 'ambos' }
]

// Reglas de validación
const rules = {
  required: value => !!value || 'Campo requerido',
  minHoras: value => (value >= 1 && value <= 24) || 'Entre 1 y 24 horas'
}

const estacionamientoRules = [
  value => !!value || 'Debe seleccionar un tipo de tarifa'
]

// Computed properties
const vehiculosItems = computed(() => {
  return vehiculosStore.obtenerVehiculos.map(vehiculo => ({
    text: `${vehiculo.placa} - ${vehiculo.color} ${vehiculo.modelo}`,
    value: vehiculo.id
  }))
})

const mostrarAutolavado = computed(() => {
  return reserva.value.tipo_servicio === 'autolavado' || reserva.value.tipo_servicio === 'ambos'
})

const mostrarEstacionamiento = computed(() => {
  return reserva.value.tipo_servicio === 'estacionamiento' || reserva.value.tipo_servicio === 'ambos'
})

const mostrarResumen = computed(() => {
  return mostrarAutolavado.value || mostrarEstacionamiento.value
})

const tieneServiciosAutolavado = computed(() => {
  const servicios = reserva.value.autolavado
  return servicios.lavado_exterior || servicios.lavado_interior ||
         servicios.encerado || servicios.aspirado ||
         servicios.limpieza_llantas || servicios.aromatizante
})

const serviciosAutolavadoSeleccionados = computed(() => {
  const servicios = []
  const precios = {
    lavado_exterior: { nombre: 'Lavado Exterior', precio: 50 },
    lavado_interior: { nombre: 'Lavado Interior', precio: 40 },
    encerado: { nombre: 'Encerado', precio: 80 },
    aspirado: { nombre: 'Aspirado', precio: 30 },
    limpieza_llantas: { nombre: 'Limpieza de Llantas', precio: 25 },
    aromatizante: { nombre: 'Aromatizante', precio: 15 }
  }

  Object.keys(reserva.value.autolavado).forEach(key => {
    if (reserva.value.autolavado[key] && precios[key]) {
      servicios.push(precios[key])
    }
  })

  return servicios
})

const calcularSubtotalAutolavado = computed(() => {
  return serviciosAutolavadoSeleccionados.value.reduce((total, servicio) => {
    return total + servicio.precio
  }, 0)
})

const calcularSubtotalEstacionamiento = computed(() => {
  if (!mostrarEstacionamiento.value) return 0

  if (reserva.value.estacionamiento.tipo_tarifa === 'tiempo_completo') {
    return 100
  } else if (reserva.value.estacionamiento.tipo_tarifa === 'por_hora') {
    const horas = reserva.value.estacionamiento.horas_estimadas || 1
    return horas * 15
  }

  return 0
})

const calcularTotal = computed(() => {
  return calcularSubtotalAutolavado.value + calcularSubtotalEstacionamiento.value
})

const formularioValido = computed(() => {
  const basico = reserva.value.fecha && reserva.value.hora &&
                 reserva.value.vehiculo_id && reserva.value.tipo_servicio

  if (!basico) return false

  // Validar autolavado si es necesario
  if ((reserva.value.tipo_servicio === 'autolavado' || reserva.value.tipo_servicio === 'ambos')
      && !tieneServiciosAutolavado.value) {
    return false
  }

  // Validar estacionamiento si es necesario
  if ((reserva.value.tipo_servicio === 'estacionamiento' || reserva.value.tipo_servicio === 'ambos')
      && !reserva.value.estacionamiento.tipo_tarifa) {
    return false
  }

  return true
})

// Methods
const onTipoServicioChange = () => {
  // Limpiar datos cuando cambia el tipo de servicio
  if (reserva.value.tipo_servicio !== 'autolavado' && reserva.value.tipo_servicio !== 'ambos') {
    Object.keys(reserva.value.autolavado).forEach(key => {
      reserva.value.autolavado[key] = false
    })
  }

  if (reserva.value.tipo_servicio !== 'estacionamiento' && reserva.value.tipo_servicio !== 'ambos') {
    reserva.value.estacionamiento.tipo_tarifa = ''
    reserva.value.estacionamiento.horas_estimadas = 1
    reserva.value.estacionamiento.hora_salida = ''
  }
}

const mostrarMensaje = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

const enviarReserva = async () => {
  try {
    const payload = {
      vehiculo_id: reserva.value.vehiculo_id,
      fecha: reserva.value.fecha,
      hora: reserva.value.hora,
      tipo_servicio: reserva.value.tipo_servicio
    }

    // Agregar datos de autolavado si aplica
    if (mostrarAutolavado.value) {
      payload.autolavado = { ...reserva.value.autolavado }
    }

    // Agregar datos de estacionamiento si aplica
    if (mostrarEstacionamiento.value) {
      payload.estacionamiento = { ...reserva.value.estacionamiento }
    }

    await reservasStore.crearReserva(payload)

    mostrarMensaje('Reserva creada exitosamente')

    // Limpiar formulario
    resetearFormulario()

    // Redireccionar después de un momento
    setTimeout(() => {
      router.push('/mis-reservas')
    }, 2000)

  } catch (error) {
    console.error('Error al crear reserva:', error)
    mostrarMensaje('Error al crear la reserva. Intente nuevamente.', 'error')
  }
}

const resetearFormulario = () => {
  reserva.value = {
    fecha: '',
    hora: '',
    vehiculo_id: null,
    tipo_servicio: '',
    autolavado: {
      lavado_exterior: false,
      lavado_interior: false,
      encerado: false,
      aspirado: false,
      limpieza_llantas: false,
      aromatizante: false
    },
    estacionamiento: {
      tipo_tarifa: '',
      horas_estimadas: 1,
      hora_salida: ''
    }
  }
}

// Watchers
watch(() => reserva.value.estacionamiento.horas_estimadas, (newHoras) => {
  if (newHoras && reserva.value.hora) {
    // Calcular hora de salida estimada
    const horaInicio = new Date(`2000-01-01T${reserva.value.hora}:00`)
    horaInicio.setHours(horaInicio.getHours() + parseInt(newHoras))

    const horas = horaInicio.getHours().toString().padStart(2, '0')
    const minutos = horaInicio.getMinutes().toString().padStart(2, '0')

    reserva.value.estacionamiento.hora_salida = `${horas}:${minutos}`
  }
})

// Lifecycle
onMounted(async () => {
  try {
    await vehiculosStore.cargarVehiculos()
  } catch (error) {
    console.error('Error al cargar vehículos:', error)
    mostrarMensaje('Error al cargar los vehículos', 'error')
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
  padding: 32px 0;
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Tarjeta principal con glassmorphism */
.v-card {
  border-radius: 28px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 45px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
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
  transform: translateY(-5px);
  box-shadow:
    0 30px 55px rgba(0, 0, 0, 0.15),
    0 15px 25px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
}

/* Toolbar con gradiente elegante */
.v-toolbar {
  background: linear-gradient(135deg, #1e3c72, #2a5298, #4a90e2) !important;
  background-size: 300% 300%;
  animation: toolbarGradient 6s ease infinite;
  color: white !important;
  border-top-left-radius: 28px !important;
  border-top-right-radius: 28px !important;
  height: 80px !important;
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
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.v-toolbar-title {
  font-size: 26px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* Campos de texto mejorados */
.v-text-field .v-field {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(30, 60, 114, 0.1) !important;
  transition: all 0.3s ease;
}

.v-text-field .v-field:hover {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(30, 60, 114, 0.2) !important;
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.1);
}

.v-text-field .v-field--focused {
  background: rgba(255, 255, 255, 1) !important;
  border-color: #1e3c72 !important;
  box-shadow: 0 0 0 2px rgba(30, 60, 114, 0.2) !important;
}

/* Select mejorado */
.v-select .v-field {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(30, 60, 114, 0.1) !important;
  transition: all 0.3s ease;
}

.v-select .v-field:hover {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(30, 60, 114, 0.2) !important;
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.1);
}

.v-select .v-field--focused {
  background: rgba(255, 255, 255, 1) !important;
  border-color: #1e3c72 !important;
  box-shadow: 0 0 0 2px rgba(30, 60, 114, 0.2) !important;
}

/* Tarjetas de servicios */
.v-card[outlined] {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(30, 60, 114, 0.15) !important;
  box-shadow: 0 8px 20px rgba(30, 60, 114, 0.08) !important;
  transition: all 0.3s ease;
}

.v-card[outlined]:hover {
  background: rgba(255, 255, 255, 0.8) !important;
  border-color: rgba(30, 60, 114, 0.25) !important;
  box-shadow: 0 12px 30px rgba(30, 60, 114, 0.12) !important;
  transform: translateY(-2px);
}

/* Títulos de tarjetas */
.v-card-title {
  font-weight: 600 !important;
  font-size: 20px !important;
  letter-spacing: 0.3px;
  color: #1e3c72 !important;
}

.primary--text {
  background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-weight: 600 !important;
}

/* Checkboxes mejorados */
.v-checkbox .v-selection-control {
  transition: all 0.2s ease;
}

.v-checkbox:hover .v-selection-control {
  transform: scale(1.05);
}

.v-checkbox .v-selection-control__wrapper {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.v-checkbox:hover .v-selection-control__wrapper {
  background: rgba(30, 60, 114, 0.05);
}

/* Radio buttons mejorados */
.v-radio .v-selection-control {
  transition: all 0.2s ease;
}

.v-radio:hover .v-selection-control {
  transform: scale(1.05);
}

.v-radio .v-selection-control__wrapper {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.v-radio:hover .v-selection-control__wrapper {
  background: rgba(30, 60, 114, 0.05);
}

/* Botones elegantes */
.v-btn {
  border-radius: 16px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  padding: 16px 28px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  text-transform: none !important;
  letter-spacing: 0.4px;
  position: relative;
  overflow: hidden;
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
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15) !important;
}

.v-btn:active {
  transform: translateY(0) scale(0.98);
}

/* Botón primario */
.v-btn[color="primary"] {
  background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
  color: #fff !important;
  box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3) !important;
}

.v-btn[color="primary"]:hover {
  box-shadow: 0 12px 30px rgba(30, 60, 114, 0.4) !important;
}

/* Botón gris */
.v-btn[color="grey"] {
  background: linear-gradient(135deg, #78909c, #90a4ae) !important;
  color: #fff !important;
  box-shadow: 0 8px 20px rgba(120, 144, 156, 0.3) !important;
}

.v-btn[color="grey"]:hover {
  box-shadow: 0 12px 30px rgba(120, 144, 156, 0.4) !important;
}

/* Botón de texto */
.v-btn[variant="text"] {
  background: transparent !important;
  color: #546e7a !important;
  box-shadow: none !important;
}

.v-btn[variant="text"]:hover {
  background: rgba(84, 110, 122, 0.1) !important;
  box-shadow: none !important;
}

/* Card de resumen */
.v-card[color="grey-lighten-4"] {
  background: linear-gradient(135deg, rgba(179, 217, 255, 0.3), rgba(230, 243, 255, 0.5)) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(30, 60, 114, 0.1) !important;
  border-radius: 20px !important;
}

/* Alertas mejoradas */
.v-alert {
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 152, 0, 0.2) !important;
}

.v-alert[type="warning"] {
  background: rgba(255, 193, 7, 0.1) !important;
  color: #e65100 !important;
}

/* Divider elegante */
.v-divider {
  background: linear-gradient(90deg, transparent, rgba(30, 60, 114, 0.2), transparent) !important;
  height: 2px !important;
}

/* Snackbar mejorado */
.v-snackbar {
  border-radius: 16px !important;
  backdrop-filter: blur(20px);
}

/* Animaciones de entrada */
.v-card-text {
  animation: fadeInUp 0.6s ease-out;
}

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

/* Efectos de carga */
.v-progress-circular {
  filter: drop-shadow(0 4px 8px rgba(30, 60, 114, 0.3));
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

/* Responsive */
@media (max-width: 768px) {
  .fill-height {
    padding: 16px 0;
  }

  .v-card {
    border-radius: 20px !important;
    margin: 0 8px;
  }

  .v-toolbar {
    height: 64px !important;
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
  }

  .v-toolbar-title {
    font-size: 20px !important;
  }

  .v-btn {
    padding: 12px 20px !important;
    font-size: 14px !important;
  }
}

/* Estados especiales */
.v-field--disabled {
  opacity: 0.6;
  filter: grayscale(0.3);
}

.v-btn--loading {
  pointer-events: none;
}

.v-btn--loading::before {
  animation: none;
}

/* Mejoras de accesibilidad */
.v-btn:focus-visible {
  outline: 2px solid #1e3c72;
  outline-offset: 2px;
}

.v-field--focused {
  outline: none;
}

/* Transiciones suaves */
* {
  transition: all 0.2s ease;
}
</style>
