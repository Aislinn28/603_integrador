// middlewares/soloEmpleado.mjs
export default function soloEmpleado(req, res, next) {
  try {
    // El middleware auth ya debe haber ejecutado antes y agregado req.usuario
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: 'Token de autenticación requerido'
      });
    }

    // Verificar que sea empleado
    if (req.usuario.tipo_usuario !== 'empleado') {
      return res.status(403).json({
        mensaje: 'Acceso denegado. Solo empleados pueden acceder a este recurso.'
      });
    }

    console.log('✅ Usuario empleado autorizado:', req.usuario.usuario);
    next();
  } catch (error) {
    console.error('Error en middleware soloEmpleado:', error);
    return res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
}