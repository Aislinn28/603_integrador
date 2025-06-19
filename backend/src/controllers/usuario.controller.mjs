import express from 'express';
import jwt from 'jsonwebtoken';
import UsuarioService from '../services/usuario.service.mjs';

const router = express.Router();

// ✅ REGISTRO CORREGIDO - ACEPTA TODOS LOS CAMPOS
router.post('/registro', async (req, res) => {
  const { nombre, apellidos, telefono, usuario, contrasenia } = req.body;

  // Validar campos requeridos
  if (!nombre || !apellidos || !telefono || !usuario || !contrasenia) {
    return res.status(400).json({ 
      mensaje: 'Todos los campos son obligatorios: nombre, apellidos, telefono, usuario, contrasenia' 
    });
  }

  try {
    const nuevoUsuario = await UsuarioService.crearRegistro({ 
      nombre, 
      apellidos, 
      telefono, 
      usuario, 
      contrasenia 
    });
    
    res.status(201).json({ 
      mensaje: 'Registro exitoso', 
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellidos: nuevoUsuario.apellidos,
        telefono: nuevoUsuario.telefono,
        usuario: nuevoUsuario.usuario
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.message === 'El usuario ya existe') {
      return res.status(409).json({ mensaje: 'El usuario ya existe' });
    }
    res.status(500).json({ mensaje: 'Error en registro' });
  }
});

// ✅ LOGIN CORREGIDO
router.post('/login', async (req, res) => {
  const { usuario, contrasenia } = req.body;

  if (!usuario || !contrasenia) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }

  try {
    const usuarioEncontrado = await UsuarioService.buscarUsuario(usuario, contrasenia);
    if (!usuarioEncontrado) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    // ✅ GENERAR TOKEN JWT
    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        nombre: usuarioEncontrado.nombre,
        tipo_usuario: usuarioEncontrado.tipo_usuario
      },
      process.env.JWT_SECRET || 'tu_clave_secreta_aqui',
      { expiresIn: '24h' }
    );

    console.log('✅ Token generado para usuario:', usuarioEncontrado.id);

    // ✅ ENVIAR TOKEN Y DATOS COMPLETOS DEL USUARIO
    res.json({
      mensaje: 'Login exitoso',
      token: token,
      id: usuarioEncontrado.id, // ⚠️ IMPORTANTE: Tu frontend busca 'id' directamente
      usuario: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        apellidos: usuarioEncontrado.apellidos,
        telefono: usuarioEncontrado.telefono,
        usuario: usuarioEncontrado.usuario,
        tipo_usuario: usuarioEncontrado.tipo_usuario
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en inicio de sesión' });
  }
});

export default router;