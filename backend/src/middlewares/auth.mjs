import jwt from 'jsonwebtoken';

export default async function auth(req, res, next) {
  try {
    // Obtener token del header Authorization
    let token = req.headers['authorization'];
    
    console.log('=== DEBUG AUTH MIDDLEWARE ===');
    console.log('Authorization header:', token);
    console.log('Todos los headers:', req.headers);
    
    // Verificar que existe el header Authorization
    if (!token) {
      console.log('❌ No se encontró token en headers');
      return res.status(401).json({ 
        mensaje: 'Acceso no autorizado. Token no proporcionado.',
        debug: {
          headers: Object.keys(req.headers)
        }
      });
    }

    // Extraer el token (remover 'Bearer ')
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
      console.log('Token limpio:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ Token no tiene formato Bearer');
      return res.status(401).json({ 
        mensaje: 'Formato de token inválido. Debe ser Bearer token.' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui');
    console.log('Token decodificado:', decoded);
    
    // Extraer usuario ID del token decodificado
    const usuarioId = decoded.id; // Ahora usamos 'id' como definimos en el controller
    
    if (!usuarioId) {
      console.log('❌ No se encontró usuario ID en el token');
      return res.status(401).json({ 
        mensaje: 'Token inválido. No contiene información de usuario.',
        debug: {
          tokenPayload: decoded
        }
      });
    }

    console.log('✅ Usuario autenticado:', usuarioId);
    
    // Agregar información del usuario a la request
    req.usuarioId = usuarioId;
    req.usuario = decoded; // Por si necesitas más info del token
    
    next();
    
  } catch (err) {
    console.error('Error en middleware auth:', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        mensaje: 'Token inválido.' 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        mensaje: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }
    
    return res.status(401).json({ 
      mensaje: 'Error en autenticación: ' + err.message 
    });
  }
}

