<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="12" class="pa-6">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>Registrar Vehículo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="volver">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="vehiculo.placa"
                :rules="placaRules"
                label="Placa del vehículo"
                required
                prepend-icon="mdi-card-text"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="vehiculo.color"
                :rules="colorRules"
                label="Color"
                required
                prepend-icon="mdi-palette"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="vehiculo.modelo"
                :rules="modeloRules"
                label="Modelo"
                required
                prepend-icon="mdi-car"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="vehiculo.version"
                label="Versión (Opcional)"
                prepend-icon="mdi-car-info"
                variant="outlined"
                class="mb-3"
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="volver"> Cancelar </v-btn>
            <v-btn color="primary" :loading="loading" :disabled="!valid" @click="registrarVehiculo">
              Registrar Vehículo
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Snackbar para mensajes -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" top>
          {{ snackbar.text }}
          <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useVehiculosStore } from '@/stores/vehiculos'

const router = useRouter()
const vehiculosStore = useVehiculosStore()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)

const vehiculo = reactive({
  placa: '',
  color: '',
  modelo: '',
  version: '',
})

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
})

// Reglas de validación
const placaRules = [
  (v) => !!v || 'La placa es obligatoria',
  (v) => (v && v.length >= 3) || 'La placa debe tener al menos 3 caracteres',
  (v) => (v && v.length <= 15) || 'La placa no puede tener más de 15 caracteres',
]

const colorRules = [
  (v) => !!v || 'El color es obligatorio',
  (v) => (v && v.length >= 2) || 'El color debe tener al menos 2 caracteres',
]

const modeloRules = [
  (v) => !!v || 'El modelo es obligatorio',
  (v) => (v && v.length >= 2) || 'El modelo debe tener al menos 2 caracteres',
]

async function registrarVehiculo() {
  if (!form.value.validate()) return

  loading.value = true

  try {
    await vehiculosStore.registrarVehiculo({
      placa: vehiculo.placa.toUpperCase(),
      color: vehiculo.color,
      modelo: vehiculo.modelo,
      version: vehiculo.version || null,
    })

    mostrarMensaje('Vehículo registrado exitosamente', 'success')

    setTimeout(() => {
      router.push('/bienvenida')
    }, 2000)
  } catch (error) {
    console.error('Error al registrar vehículo:', error)
    mostrarMensaje(error || 'Error al registrar vehículo', 'error')
  } finally {
    loading.value = false
  }
}

function mostrarMensaje(texto, color) {
  snackbar.text = texto
  snackbar.color = color
  snackbar.show = true
}

function volver() {
  router.push('/bienvenida')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
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
    radial-gradient(circle at 25% 25%, rgba(74, 144, 226, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 75% 75%, rgba(30, 60, 114, 0.1) 0%, transparent 60%),
    linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
  pointer-events: none;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Tarjeta principal con glassmorphism mejorado */
.v-card {
  border-radius: 32px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(25px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.12),
    0 15px 25px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.v-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(30, 60, 114, 0.3), transparent);
}

.v-card:hover {
  transform: translateY(-8px) scale(1.01) !important;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.15),
    0 20px 30px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
}

/* Toolbar con diseño premium */
.v-toolbar {
  background: linear-gradient(135deg, #1e3c72, #2a5298, #4a90e2) !important;
  background-size: 300% 300% !important;
  animation: toolbarGradient 8s ease infinite !important;
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  height: 85px !important;
  position: relative !important;
  overflow: visible !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 24px !important;
}

:deep(.v-toolbar__content) {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  overflow: visible !important;
}

.v-toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmer 4s infinite;
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
  font-size: 28px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  position: relative;
  z-index: 1;
  color: white !important;
  text-overflow: visible !important;
  overflow: visible !important;
  white-space: nowrap !important;
  flex: 1 !important;
}

/* Contenido de la tarjeta */
.v-card-text {
  padding: 40px !important;
  background: transparent !important;
}

/* Campos de texto mejorados */
:deep(.v-text-field) {
  margin-bottom: 20px !important;
}

:deep(.v-field) {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(30, 60, 114, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

:deep(.v-field:hover) {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(30, 60, 114, 0.2) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-1px) !important;
}

:deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: #2a5298 !important;
  box-shadow:
    0 8px 20px rgba(42, 82, 152, 0.15),
    0 0 0 3px rgba(42, 82, 152, 0.1) !important;
  transform: translateY(-2px) !important;
}

:deep(.v-field__input) {
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #2d3748 !important;
  padding: 16px 20px !important;
}

:deep(.v-field__prepend-inner .v-icon) {
  color: #2a5298 !important;
  margin-right: 12px !important;
  transition: all 0.2s ease !important;
}

:deep(.v-field:hover .v-field__prepend-inner .v-icon) {
  color: #1e3c72 !important;
  transform: scale(1.1) !important;
}

/* Labels mejorados */
:deep(.v-label) {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #4a5568 !important;
  letter-spacing: 0.3px !important;
}

:deep(.v-field--focused .v-label) {
  color: #2a5298 !important;
}

/* Mensajes de error */
:deep(.v-messages__message) {
  color: #e53e3e !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  margin-top: 4px !important;
}

/* Acciones de la tarjeta */
.v-card-actions {
  padding: 24px 40px 40px !important;
  background: transparent !important;
}

/* Botones premium */
:deep(.v-btn) {
  border-radius: 18px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  padding: 14px 32px !important;
  text-transform: none !important;
  letter-spacing: 0.4px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

:deep(.v-btn::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

:deep(.v-btn:hover::before) {
  left: 100%;
}

/* Botón primario */
:deep(.v-btn--variant-elevated.bg-primary) {
  background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
  color: white !important;
  box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3) !important;
}

:deep(.v-btn--variant-elevated.bg-primary:hover) {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 12px 28px rgba(30, 60, 114, 0.4) !important;
}

:deep(.v-btn--variant-elevated.bg-primary:active) {
  transform: translateY(0) scale(0.98) !important;
}

/* Botón secundario */
:deep(.v-btn--variant-text) {
  color: #4a5568 !important;
  background: rgba(74, 85, 104, 0.08) !important;
}

:deep(.v-btn--variant-text:hover) {
  background: rgba(74, 85, 104, 0.12) !important;
  transform: translateY(-1px) !important;
}

/* Botón de volver en toolbar */
:deep(.v-toolbar .v-btn) {
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px) !important;
  transition: all 0.2s ease !important;
  min-width: 48px !important;
  height: 48px !important;
  margin-left: 16px !important;
  flex-shrink: 0 !important;
}

:deep(.v-toolbar .v-btn:hover) {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: scale(1.05) !important;
}

:deep(.v-toolbar .v-btn .v-icon) {
  color: white !important;
  font-size: 24px !important;
}

/* Loading state */
:deep(.v-btn--loading .v-btn__loader) {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Disabled state */
:deep(.v-btn--disabled) {
  background: rgba(74, 85, 104, 0.1) !important;
  color: rgba(74, 85, 104, 0.4) !important;
  box-shadow: none !important;
}

/* Snackbar mejorado */
:deep(.v-snackbar) {
  border-radius: 16px !important;
  backdrop-filter: blur(20px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

:deep(.v-snackbar--variant-elevated) {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #2d3748 !important;
}

:deep(.v-snackbar.bg-success) {
  background: linear-gradient(135deg, #48bb78, #38a169) !important;
}

:deep(.v-snackbar.bg-error) {
  background: linear-gradient(135deg, #f56565, #e53e3e) !important;
}

/* Animaciones de entrada */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.v-card {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .v-card {
    border-radius: 24px !important;
    margin: 16px !important;
  }

  .v-toolbar {
    height: 70px !important;
    border-top-left-radius: 24px !important;
    border-top-right-radius: 24px !important;
    padding: 0 16px !important;
  }

  .v-toolbar-title {
    font-size: 20px !important;
  }

  :deep(.v-toolbar .v-btn) {
    min-width: 40px !important;
    height: 40px !important;
    margin-left: 8px !important;
  }

  :deep(.v-toolbar .v-btn .v-icon) {
    font-size: 20px !important;
  }

  .v-card-text {
    padding: 24px !important;
  }

  .v-card-actions {
    padding: 16px 24px 24px !important;
  }

  :deep(.v-btn) {
    padding: 12px 24px !important;
    font-size: 14px !important;
  }

  :deep(.v-field__input) {
    padding: 14px 16px !important;
    font-size: 15px !important;
  }
}

/* Focus trap mejorado */
:deep(.v-field--focused .v-field__outline) {
  border-width: 2px !important;
  border-color: #2a5298 !important;
}

/* Micro-interactions */
:deep(.v-icon) {
  transition: all 0.2s ease !important;
}

:deep(.v-text-field:hover .v-icon) {
  transform: scale(1.05) !important;
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
</style>
