<template>
  <div class="reservas-clientes">
    <h1>Reservas Confirmadas de Clientes</h1>

    <!-- debug, loading, error, tabla igual -->

    <div v-if="loading" class="centered">Cargando reservas...</div>
    <div v-else-if="error" class="error-box"><strong>Error:</strong> {{ error }}</div>
    <div v-else-if="reservas.length === 0" class="centered">
      No hay reservas confirmadas disponibles.
    </div>

    <div v-else class="tabla-container">
      <table class="reservas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Placa</th>
            <th>Color</th>
            <th>Modelo</th>
            <th>Versión</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Tipo Servicio</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.id }}</td>
            <td>{{ reserva.nombre_usuario }} {{ reserva.apellidos_usuario }}</td>
            <td>{{ reserva.telefono || 'N/A' }}</td>
            <td>{{ reserva.placa }}</td>
            <td>{{ reserva.color }}</td>
            <td>{{ reserva.modelo }}</td>
            <td>{{ reserva.version }}</td>
            <td>{{ formatearFecha(reserva.fecha) }}</td>
            <td>{{ reserva.hora }}</td>
            <td>{{ formatearTipoServicio(reserva.tipo_servicio) }}</td>
            <td>${{ reserva.total }}</td>
            <td>
              <span class="estado-badge" :class="reserva.estado">{{ reserva.estado }}</span>
            </td>
            <td>
              <button class="btn-primary" @click="generarTicket(reserva)">Generar Ticket</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Mejorado -->
  <div v-if="mostrarModalTicket" class="modal-backdrop" @click.self="mostrarModalTicket = false">
    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <header>
        <h2 id="modalTitle">🎫 Ticket de Reserva #{{ ticketSeleccionado.id }}</h2>
        <button class="close-btn" aria-label="Cerrar" @click="mostrarModalTicket = false">
          &times;
        </button>
      </header>

      <section class="modal-body">
        <p>
          <strong>Cliente:</strong> {{ ticketSeleccionado.nombre_usuario }}
          {{ ticketSeleccionado.apellidos_usuario }}
        </p>
        <p>
          <strong>Vehículo:</strong> {{ ticketSeleccionado.modelo }} -
          {{ ticketSeleccionado.version }} ({{ ticketSeleccionado.color }})
        </p>
        <p><strong>Placa:</strong> {{ ticketSeleccionado.placa }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(ticketSeleccionado.fecha) }}</p>
        <p><strong>Hora:</strong> {{ ticketSeleccionado.hora }}</p>

        <hr />

        <!-- Detalles Autolavado -->
        <div
          v-if="['autolavado', 'ambos'].includes(ticketSeleccionado.tipo_servicio)"
          class="servicio-detalle"
        >
          <h3>🚿 Autolavado</h3>
          <p>
            <strong>Tipo de Autolavado:</strong> {{ ticketSeleccionado.autolavado_tipo || 'N/A' }}
          </p>
          <p>
            <strong>Modo:</strong>
            {{ ticketSeleccionado.autolavado_modo === 'libre' ? 'Tiempo libre' : 'Por horas' }}
          </p>
          <p v-if="ticketSeleccionado.autolavado_modo === 'horas'">
            <strong>Horas contratadas:</strong> {{ ticketSeleccionado.autolavado_horas }}
          </p>
        </div>

        <!-- Detalles Estacionamiento -->
        <div
          v-if="['estacionamiento', 'ambos'].includes(ticketSeleccionado.tipo_servicio)"
          class="servicio-detalle"
        >
          <h3>🅿️ Estacionamiento</h3>
          <p>
            <strong>Modo:</strong>
            {{ ticketSeleccionado.estacionamiento_modo === 'libre' ? 'Tiempo libre' : 'Por horas' }}
          </p>
          <p v-if="ticketSeleccionado.estacionamiento_modo === 'horas'">
            <strong>Horas contratadas:</strong> {{ ticketSeleccionado.estacionamiento_horas }}
          </p>
        </div>

        <hr />
        <p class="total-costo"><strong>Costo Total:</strong> ${{ ticketSeleccionado.total }}</p>
      </section>

      <footer>
        <button class="btn-primary" @click="descargarPDF">Descargar PDF</button>
        <button class="btn-secondary" @click="mostrarModalTicket = false">Cerrar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ReservasService } from '@/services'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const reservas = ref([])
const loading = ref(false)
const error = ref('')
const tipoUsuario = ref(localStorage.getItem('tipo_usuario'))
const token = ref(localStorage.getItem('token'))

const mostrarModalTicket = ref(false)
const ticketSeleccionado = ref(null)

const generarTicket = (reserva) => {
  ticketSeleccionado.value = reserva
  mostrarModalTicket.value = true
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const formatearTipoServicio = (tipo) => {
  const tipos = {
    autolavado: 'Autolavado',
    estacionamiento: 'Estacionamiento',
    ambos: 'Autolavado + Estacionamiento',
  }
  return tipos[tipo] || tipo
}

const descargarPDF = () => {
  if (!ticketSeleccionado.value) return

  const doc = new jsPDF()

  // Configuración de colores mejorada
  const colorPrimario = [41, 128, 185] // Azul profesional
  const colorSecundario = [52, 73, 94] // Gris azulado
  const colorExito = [39, 174, 96] // Verde
  const colorTexto = [44, 62, 80] // Gris oscuro profesional
  const colorFondo = [236, 240, 241] // Gris claro

  // HEADER PRINCIPAL CON DISEÑO MODERNO
  doc.setFillColor(...colorPrimario)
  doc.rect(0, 0, 210, 40, 'F')

  // Logo o icono simulado
  doc.setFillColor(255, 255, 255)
  doc.circle(30, 20, 8, 'F')
  doc.setTextColor(...colorPrimario)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('AUTO', 26, 22)

  // Título principal mejorado
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('TICKET DE RESERVA', 105, 18, { align: 'center' })

  // Número de reserva con estilo
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(`No. ${String(ticketSeleccionado.value.id).padStart(6, '0')}`, 105, 28, { align: 'center' })

  // Fecha de generación
  doc.setFontSize(10)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 105, 35, { align: 'center' })

  // INFORMACIÓN DEL CLIENTE
  let y = 55
  doc.setTextColor(...colorSecundario)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DEL CLIENTE', 20, y)

  // Línea decorativa bajo el título
  doc.setDrawColor(...colorPrimario)
  doc.setLineWidth(2)
  doc.line(20, y + 3, 95, y + 3)

  y += 12
  // Caja con fondo para información del cliente
  doc.setFillColor(...colorFondo)
  doc.rect(20, y, 170, 28, 'F')
  doc.setDrawColor(189, 195, 199)
  doc.setLineWidth(0.5)
  doc.rect(20, y, 170, 28)

  y += 8
  doc.setTextColor(...colorTexto)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:', 25, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${ticketSeleccionado.value.nombre_usuario} ${ticketSeleccionado.value.apellidos_usuario}`, 55, y)

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text('TELEFONO:', 25, y)
  doc.setFont('helvetica', 'normal')
  doc.text(ticketSeleccionado.value.telefono || 'No registrado', 58, y)

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text('FECHA:', 25, y)
  doc.setFont('helvetica', 'normal')
  doc.text(formatearFecha(ticketSeleccionado.value.fecha), 48, y)

  doc.setFont('helvetica', 'bold')
  doc.text('HORA:', 120, y)
  doc.setFont('helvetica', 'normal')
  doc.text(ticketSeleccionado.value.hora, 140, y)

  // INFORMACIÓN DEL VEHÍCULO
  y += 20
  doc.setTextColor(...colorSecundario)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DEL VEHICULO', 20, y)

  // Línea decorativa
  doc.setDrawColor(...colorPrimario)
  doc.setLineWidth(2)
  doc.line(20, y + 3, 110, y + 3)

  y += 12
  // Caja para información del vehículo
  doc.setFillColor(...colorFondo)
  doc.rect(20, y, 170, 22, 'F')
  doc.setDrawColor(189, 195, 199)
  doc.rect(20, y, 170, 22)

  y += 8
  doc.setTextColor(...colorTexto)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('VEHICULO:', 25, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${ticketSeleccionado.value.modelo} - ${ticketSeleccionado.value.version}`, 58, y)

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text('PLACA:', 25, y)
  doc.setFont('helvetica', 'normal')
  doc.text(ticketSeleccionado.value.placa, 48, y)

  doc.setFont('helvetica', 'bold')
  doc.text('COLOR:', 120, y)
  doc.setFont('helvetica', 'normal')
  doc.text(ticketSeleccionado.value.color, 145, y)

  // SERVICIOS CONTRATADOS
  y += 25
  doc.setTextColor(...colorSecundario)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('SERVICIOS CONTRATADOS', 20, y)

  // Línea decorativa
  doc.setDrawColor(...colorPrimario)
  doc.setLineWidth(2)
  doc.line(20, y + 3, 135, y + 3)

  y += 15

  // SERVICIO DE AUTOLAVADO
  if (['autolavado', 'ambos'].includes(ticketSeleccionado.value.tipo_servicio)) {
    // Recolectar servicios incluidos
    const serviciosAutolavado = []
    if (ticketSeleccionado.value.lavado_exterior) serviciosAutolavado.push('Lavado Exterior')
    if (ticketSeleccionado.value.lavado_interior) serviciosAutolavado.push('Lavado Interior')
    if (ticketSeleccionado.value.encerado) serviciosAutolavado.push('Encerado')
    if (ticketSeleccionado.value.aspirado) serviciosAutolavado.push('Aspirado')
    if (ticketSeleccionado.value.limpieza_llantas) serviciosAutolavado.push('Limpieza de Llantas')
    if (ticketSeleccionado.value.aromatizante) serviciosAutolavado.push('Aromatizante')

    const alturaAutolavado = 25 + (serviciosAutolavado.length * 5) + 10

    // Caja de servicio autolavado
    doc.setFillColor(231, 244, 253) // Azul muy claro
    doc.rect(20, y, 170, alturaAutolavado, 'F')
    doc.setDrawColor(...colorPrimario)
    doc.setLineWidth(1)
    doc.rect(20, y, 170, alturaAutolavado)

    // Header del servicio
    doc.setFillColor(...colorPrimario)
    doc.rect(20, y, 170, 12, 'F')

    y += 8
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SERVICIO DE AUTOLAVADO', 25, y)

    y += 10
    doc.setTextColor(...colorTexto)
    doc.setFontSize(10)

    // Modalidad de servicio
    const modalidadAutolavado = ticketSeleccionado.value.autolavado_tipo_tarifa === 'por_hora' ? 'Por Horas' : 'Tiempo Completo'
    doc.setFont('helvetica', 'bold')
    doc.text('Modalidad:', 25, y)
    doc.setFont('helvetica', 'normal')
    doc.text(modalidadAutolavado, 55, y)

    // Horas estimadas si aplica
    if (ticketSeleccionado.value.autolavado_tipo_tarifa === 'por_hora' && ticketSeleccionado.value.autolavado_horas_estimadas) {
      doc.setFont('helvetica', 'bold')
      doc.text('Horas:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(`${ticketSeleccionado.value.autolavado_horas_estimadas} hrs`, 140, y)
    }

    y += 8
    doc.setFont('helvetica', 'bold')
    doc.text('Servicios incluidos:', 25, y)

    // Lista de servicios con viñetas
    if (serviciosAutolavado.length > 0) {
      serviciosAutolavado.forEach(servicio => {
        y += 5
        doc.setFillColor(...colorExito)
        doc.circle(28, y - 1, 1, 'F') // Punto verde
        doc.setFont('helvetica', 'normal')
        doc.text(servicio, 32, y)
      })
    } else {
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.text('Servicios basicos incluidos', 32, y)
    }

    // Subtotal
    if (ticketSeleccionado.value.autolavado_subtotal) {
      y += 8
      doc.setFont('helvetica', 'bold')
      doc.text('Subtotal:', 130, y)
      doc.text(`$${ticketSeleccionado.value.autolavado_subtotal}`, 165, y, { align: 'right' })
    }

    y += 15
  }

  // SERVICIO DE ESTACIONAMIENTO
  if (['estacionamiento', 'ambos'].includes(ticketSeleccionado.value.tipo_servicio)) {
    const alturaEstacionamiento = 35

    // Caja de servicio estacionamiento
    doc.setFillColor(252, 248, 227) // Amarillo muy claro
    doc.rect(20, y, 170, alturaEstacionamiento, 'F')
    doc.setDrawColor(241, 196, 15) // Amarillo
    doc.setLineWidth(1)
    doc.rect(20, y, 170, alturaEstacionamiento)

    // Header del servicio
    doc.setFillColor(241, 196, 15)
    doc.rect(20, y, 170, 12, 'F')

    y += 8
    doc.setTextColor(52, 73, 94)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SERVICIO DE ESTACIONAMIENTO', 25, y)

    y += 10
    doc.setTextColor(...colorTexto)
    doc.setFontSize(10)

    // Modalidad
    const modalidadEst = ticketSeleccionado.value.estacionamiento_tipo_tarifa === 'por_hora' ? 'Por Horas' : 'Tiempo Completo'
    doc.setFont('helvetica', 'bold')
    doc.text('Modalidad:', 25, y)
    doc.setFont('helvetica', 'normal')
    doc.text(modalidadEst, 55, y)

    // Horas estimadas
    if (ticketSeleccionado.value.estacionamiento_horas_estimadas) {
      doc.setFont('helvetica', 'bold')
      doc.text('Tiempo:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(`${ticketSeleccionado.value.estacionamiento_horas_estimadas} hrs`, 140, y)
    }

    // Hora de salida estimada
    if (ticketSeleccionado.value.estacionamiento_hora_salida) {
      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Salida estimada:', 25, y)
      doc.setFont('helvetica', 'normal')
      doc.text(ticketSeleccionado.value.estacionamiento_hora_salida, 70, y)
    }

    // Subtotal
    if (ticketSeleccionado.value.estacionamiento_subtotal) {
      y += 8
      doc.setFont('helvetica', 'bold')
      doc.text('Subtotal:', 130, y)
      doc.text(`$${ticketSeleccionado.value.estacionamiento_subtotal}`, 165, y, { align: 'right' })
    }

    y += 15
  }

  // TOTAL DESTACADO
  y += 10
  const alturaTotal = 18
  doc.setFillColor(...colorExito)
  doc.rect(20, y, 170, alturaTotal, 'F')

  // Sombra del total
  doc.setFillColor(0, 0, 0, 0.1)
  doc.rect(22, y + 2, 170, alturaTotal, 'F')

  y += 12
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL A PAGAR:', 25, y)
  doc.setFontSize(24)
  doc.text(`$${ticketSeleccionado.value.total}`, 165, y, { align: 'right' })

  // FOOTER INFORMATIVO
  y += 25
  doc.setDrawColor(...colorPrimario)
  doc.setLineWidth(1)
  doc.line(20, y, 190, y)

  y += 10
  doc.setTextColor(...colorSecundario)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMACION IMPORTANTE', 105, y, { align: 'center' })

  y += 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('• Presente este ticket al momento de solicitar el servicio', 20, y)
  y += 5
  doc.text('• Conserve este comprobante hasta completar el servicio', 20, y)
  y += 5
  doc.text('• Para consultas comuniquese con nuestro personal', 20, y)

  y += 10
  doc.setTextColor(127, 140, 141)
  doc.setFontSize(8)
  doc.text('Gracias por confiar en nuestros servicios de autolavado y estacionamiento', 105, y, { align: 'center' })

  // CÓDIGO DE IDENTIFICACIÓN
  y += 8
  doc.setFillColor(236, 240, 241)
  doc.rect(70, y, 70, 15, 'F')
  doc.setDrawColor(189, 195, 199)
  doc.rect(70, y, 70, 15)

  y += 10
  doc.setTextColor(...colorTexto)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`CODIGO: RSV-${String(ticketSeleccionado.value.id).padStart(6, '0')}`, 105, y, { align: 'center' })

  // Guardar el PDF
  const nombreArchivo = `Ticket_Reserva_${String(ticketSeleccionado.value.id).padStart(6, '0')}.pdf`
  doc.save(nombreArchivo)
}

onMounted(async () => {
  if (tipoUsuario.value !== 'empleado') {
    error.value = 'Solo los empleados pueden ver las reservas de clientes'
    return
  }
  if (!token.value) {
    error.value = 'No hay token de autenticación'
    return
  }
  await cargarReservas()
})

const cargarReservas = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await ReservasService.instance.obtenerReservasConfirmadas()
    reservas.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = typeof err === 'string' ? err : 'Error al cargar las reservas'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.reservas-clientes {
  padding: 40px;
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.reservas-clientes::before {
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

.reservas-clientes h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

.centered {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.error-box {
  color: #e53e3e;
  background: rgba(254, 178, 178, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
  font-weight: 600;
  border: 1px solid rgba(229, 62, 62, 0.3);
  box-shadow: 0 10px 25px rgba(229, 62, 62, 0.2);
  position: relative;
  z-index: 1;
}

.tabla-container {
  overflow-x: auto;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 45px rgba(0, 0, 0, 0.1),
    0 10px 15px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tabla-container:hover {
  transform: translateY(-5px);
  box-shadow:
    0 35px 60px rgba(0, 0, 0, 0.15),
    0 15px 25px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.reservas-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  background: white;
}

.reservas-table th,
.reservas-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  font-size: 15px;
  transition: all 0.2s ease;
}

.reservas-table th {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 13px;
  position: relative;
  overflow: hidden;
}

.reservas-table th::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.reservas-table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.reservas-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(30, 60, 114, 0.05), rgba(74, 144, 226, 0.05));
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.1);
}

.reservas-table tbody tr:nth-child(even) {
  background-color: rgba(248, 250, 252, 0.5);
}

.estado-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
  min-width: 90px;
  text-align: center;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.estado-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.estado-badge.confirmada {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
}

.estado-badge.pendiente {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
}

.estado-badge.completada {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
}

.estado-badge.cancelada {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(30, 60, 114, 0.4);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

.btn-secondary {
  background: linear-gradient(135deg, #718096, #4a5568);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 12px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(113, 128, 150, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-secondary:hover::before {
  left: 100%;
}

.btn-secondary:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(113, 128, 150, 0.4);
}

.btn-secondary:active {
  transform: translateY(0) scale(0.98);
}

/* Modal con Glassmorphism */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  max-width: 550px;
  width: 90%;
  padding: 35px 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 25px 45px rgba(0, 0, 0, 0.2),
    0 10px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  position: relative;
  animation: modalAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  overflow: hidden;
}

.modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-container header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(30, 60, 114, 0.1);
}

.modal-container header h2 {
  font-size: 1.8rem;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  color: #4a5568;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #e53e3e;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.modal-body p {
  margin: 12px 0;
  font-size: 1.05rem;
  color: #2d3748;
  line-height: 1.6;
}

.modal-body p strong {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

.modal-body hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(30, 60, 114, 0.2), transparent);
  margin: 20px 0;
}

.servicio-detalle {
  background: linear-gradient(135deg, rgba(30, 60, 114, 0.05), rgba(74, 144, 226, 0.05));
  border-left: 4px solid;
  border-image: linear-gradient(135deg, #1e3c72, #2a5298) 1;
  padding: 20px;
  margin: 20px 0;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.1);
  transition: all 0.3s ease;
}

.servicio-detalle:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 18px rgba(30, 60, 114, 0.15);
}

.servicio-detalle h3 {
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  font-size: 1.2rem;
}

.total-costo {
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(56, 161, 105, 0.1));
  border-radius: 12px;
  text-align: center;
  border: 2px solid rgba(72, 187, 120, 0.2);
}

.total-costo strong {
  background: linear-gradient(135deg, #48bb78, #38a169);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-container footer {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 2px solid rgba(30, 60, 114, 0.1);
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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
  .reservas-clientes {
    padding: 20px 15px;
  }

  .reservas-clientes h1 {
    font-size: 2rem;
  }

  .tabla-container {
    padding: 15px;
    border-radius: 16px;
  }

  .reservas-table th,
  .reservas-table td {
    padding: 12px 8px;
    font-size: 13px;
  }

  .modal-container {
    max-width: 95%;
    padding: 25px 20px;
    border-radius: 16px;
  }

  .modal-container header h2 {
    font-size: 1.4rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 16px;
    font-size: 13px;
  }

  .estado-badge {
    padding: 6px 12px;
    font-size: 11px;
    min-width: 70px;
  }
}

@media (max-width: 480px) {
  .reservas-table {
    font-size: 12px;
  }

  .reservas-table th,
  .reservas-table td {
    padding: 8px 4px;
  }

  .modal-container footer {
    flex-direction: column;
    gap: 8px;
  }

  .btn-secondary {
    margin-left: 0;
  }
}
</style>
