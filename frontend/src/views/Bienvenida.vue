<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="12" class="pa-6">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>Bienvenido</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <p>
              ¡Bienvenido, <strong>{{ usuario.usuario }}</strong
              >!
            </p>

            <v-btn color="info" class="ma-2" @click="mostrarInfo = !mostrarInfo">
              {{ mostrarInfo ? 'Ocultar Información Personal' : 'Información Personal' }}
            </v-btn>

            <v-expand-transition>
              <div v-if="mostrarInfo" class="mt-4">
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Nombre:</strong> {{ usuario.nombre }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Apellidos:</strong> {{ usuario.apellidos }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Teléfono:</strong> {{ usuario.telefono }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        ><strong>Usuario:</strong> {{ usuario.usuario }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-expand-transition>

            <v-btn color="primary" class="ma-2" @click="irARegistrarCarro">Registrar Carro</v-btn>
            <v-btn color="secondary" class="ma-2" @click="irARealizarReserva"
              >Realizar Reserva</v-btn
            >
            <v-btn color="info" class="ma-2" @click="irAMisReservas">
              <v-icon left>mdi-calendar-text</v-icon>
              Mis Reservas
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario_store'
import { ref } from 'vue'

const router = useRouter()
const usuarioStore = useUsuarioStore()
const usuario = usuarioStore.obtenerUsuarioActual

const mostrarInfo = ref(false)

function irARegistrarCarro() {
  router.push('/registrar-carro')
}

function irARealizarReserva() {
  router.push('/realizar-reserva')
}

function irAMisReservas() {
  router.push('/mis-reservas')
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
  padding: 32px;
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
  padding-bottom: 32px;
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
  padding: 0 32px;
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
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* Contenido de la tarjeta */
.v-card-text {
  padding: 32px;
  font-size: 17px;
  color: #2d3748;
  line-height: 1.7;
  font-weight: 400;
}

/* Lista de datos personales */
.v-list-item-title {
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
  transition: color 0.2s ease;
}

.v-list-item:hover .v-list-item-title {
  color: #1e3c72;
}

/* Botones con efectos avanzados */
.v-btn {
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.4px;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
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
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.v-btn:active {
  transform: translateY(0) scale(0.98);
}

/* Colores personalizados con gradientes */
.v-btn.color-primary {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: #fff !important;
  box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3);
}

.v-btn.color-primary:hover {
  box-shadow: 0 12px 30px rgba(30, 60, 114, 0.4);
}

.v-btn.color-info {
  background: linear-gradient(135deg, #4a90e2, #74b9ff);
  color: #fff !important;
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.3);
}

.v-btn.color-info:hover {
  box-shadow: 0 12px 30px rgba(74, 144, 226, 0.4);
}

.v-btn.color-secondary {
  background: linear-gradient(135deg, #b3d9ff, #e6f3ff);
  color: #4a5568 !important;
  box-shadow: 0 8px 20px rgba(179, 217, 255, 0.3);
}

.v-btn.color-secondary:hover {
  box-shadow: 0 12px 30px rgba(179, 217, 255, 0.4);
}

.v-icon {
  margin-right: 8px;
  vertical-align: middle;
  transition: transform 0.2s ease;
}

.v-btn:hover .v-icon {
  transform: scale(1.1);
}

strong {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

/* Animaciones mejoradas */
.v-expand-transition {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos de micro-interacciones */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.v-list-item {
  transition: all 0.2s ease;
  border-radius: 12px;
  margin: 4px 0;
}

.v-list-item:hover {
  background: rgba(30, 60, 114, 0.05);
  transform: translateX(4px);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

/* Responsive enhancements */
@media (max-width: 768px) {
  .fill-height {
    padding: 16px;
  }

  .v-card {
    border-radius: 20px;
  }

  .v-toolbar {
    height: 64px;
    padding: 0 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .v-toolbar-title {
    font-size: 20px;
  }

  .v-card-text {
    padding: 20px;
    font-size: 15px;
  }

  .v-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
}</style>
