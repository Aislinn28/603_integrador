import express from 'express';
import ReservaService from '../services/reserva.service.mjs';
import auth from '../middlewares/auth.mjs';
import soloEmpleado from '../middlewares/soloEmpleado.mjs';

const router = express.Router();

// Obtener todas las reservas del usuario
router.get('/', auth, async (req, res) => {
  try {
    const reservas = await ReservaService.obtenerReservasPorUsuario(req.usuarioId);
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
});

// Crear nueva reserva
router.post('/crear', auth, async (req, res) => {
  const { 
    vehiculo_id, 
    fecha, 
    hora, 
    tipo_servicio,
    autolavado,
    estacionamiento 
  } = req.body;

  // Validaciones básicas
  if (!vehiculo_id || !fecha || !hora || !tipo_servicio) {
    return res.status(400).json({
      mensaje: 'Vehículo, fecha, hora y tipo de servicio son obligatorios'
    });
  }

  // Validar tipo de servicio
  if (!['autolavado', 'estacionamiento', 'ambos'].includes(tipo_servicio)) {
    return res.status(400).json({
      mensaje: 'Tipo de servicio no válido'
    });
  }

  // Validar datos específicos según el tipo de servicio
  if ((tipo_servicio === 'autolavado' || tipo_servicio === 'ambos') && !autolavado) {
    return res.status(400).json({
      mensaje: 'Datos de autolavado son requeridos'
    });
  }

  if ((tipo_servicio === 'estacionamiento' || tipo_servicio === 'ambos') && !estacionamiento) {
    return res.status(400).json({
      mensaje: 'Datos de estacionamiento son requeridos'
    });
  }

  try {
    const nuevaReserva = await ReservaService.crearReserva({
      usuario_id: req.usuarioId,
      vehiculo_id,
      fecha,
      hora,
      tipo_servicio,
      autolavado,
      estacionamiento
    });

    res.status(201).json({
      mensaje: 'Reserva creada exitosamente',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ mensaje: 'Error al crear reserva' });
  }
});

// Actualizar estado de reserva
router.put('/:id/estado', auth, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['pendiente', 'confirmada', 'completada', 'cancelada'].includes(estado)) {
    return res.status(400).json({
      mensaje: 'Estado no válido'
    });
  }

  try {
    await ReservaService.actualizarEstadoReserva(id, estado, req.usuarioId);
    res.json({ mensaje: 'Estado de reserva actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar estado de reserva' });
  }
});

// Eliminar reserva
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    await ReservaService.eliminarReserva(id, req.usuarioId);
    res.json({ mensaje: 'Reserva eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ mensaje: 'Error al eliminar reserva' });
  }
});

router.get('/confirmadas', auth, soloEmpleado, async (req, res) => {
  try {
    const reservas = await ReservaService.obtenerReservasConfirmadas();
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas confirmadas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas confirmadas' });
  }
});




export default router;