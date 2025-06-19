import express from 'express';
import VehiculoService from '../services/vehiculo.service.mjs';
import auth from '../middlewares/auth.mjs';

const router = express.Router();

// Obtener todos los vehículos del usuario logueado
router.get('/', auth, async (req, res) => {
  try {
    const vehiculos = await VehiculoService.obtenerVehiculosPorUsuario(req.usuarioId);
    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ mensaje: 'Error al obtener vehículos' });
  }
});

// Registrar un nuevo vehículo
router.post('/registro', auth, async (req, res) => {
  const { placa, color, modelo, version } = req.body;

  // Validaciones
  if (!placa || !color || !modelo) {
    return res.status(400).json({ 
      mensaje: 'Placa, color y modelo son obligatorios' 
    });
  }

  try {
    const nuevoVehiculo = await VehiculoService.crearVehiculo({
      placa,
      color,
      modelo,
      version: version || null,
      usuario_id: req.usuarioId
    });
    
    res.status(201).json({ 
      mensaje: 'Vehículo registrado exitosamente', 
      vehiculo: nuevoVehiculo 
    });
  } catch (error) {
    console.error('Error al registrar vehículo:', error);
    
    // Si es error de placa duplicada
    if (error.message.includes('Duplicate entry') || error.message.includes('placa')) {
      return res.status(409).json({ mensaje: 'La placa ya está registrada' });
    }
    
    res.status(500).json({ mensaje: 'Error al registrar vehículo' });
  }
});

// Actualizar vehículo
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { placa, color, modelo, version } = req.body;

  if (!placa || !color || !modelo) {
    return res.status(400).json({ 
      mensaje: 'Placa, color y modelo son obligatorios' 
    });
  }

  try {
    await VehiculoService.actualizarVehiculo(id, {
      placa,
      color,
      modelo,
      version: version || null,
      usuario_id: req.usuarioId
    });
    
    res.json({ mensaje: 'Vehículo actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({ mensaje: 'Error al actualizar vehículo' });
  }
});

// Eliminar vehículo
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    await VehiculoService.eliminarVehiculo(id, req.usuarioId);
    res.json({ mensaje: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ mensaje: 'Error al eliminar vehículo' });
  }
});

export default router;