function crearSesion(token, userData) {
  try {
    localStorage.setItem('sesion_token', token);
    localStorage.setItem('sesion_data', JSON.stringify(userData));
    localStorage.setItem('usuario_id', userData.id);
    console.log('Sesión creada:', userData); // Debug
  } catch (error) {
    console.error('Error al crear sesión:', error);
  }
}

function obtenerSesion() {
  try {
    const token = localStorage.getItem('sesion_token');
    const data = localStorage.getItem('sesion_data');

    if (token && data) {
      return {
        token: token,
        ...JSON.parse(data)
      };
    }

    // Fallback para compatibilidad
    const usuarioId = localStorage.getItem('usuario_id');
    if (usuarioId) {
      return {
        id: usuarioId,
        token: localStorage.getItem('token') || 'simple_token'
      };
    }

    return null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
}

function verificarSesion() {
  const sesion = obtenerSesion();
  return sesion && sesion.id;
}

function eliminarSesion() {
  localStorage.removeItem('sesion_token');
  localStorage.removeItem('sesion_data');
  localStorage.removeItem('usuario_id');
  localStorage.removeItem('token');
}

export { crearSesion, obtenerSesion, verificarSesion, eliminarSesion };
