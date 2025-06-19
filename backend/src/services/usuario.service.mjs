import { executeQuery } from "../middlewares/db.mjs";

// Obtener todos los clientes
async function obtenerClientes() {
  try {
    const result = await executeQuery("SELECT * FROM cliente");
    return result.recordset;
  } catch (error) {
    console.log("Error:", error);
    throw "Error al obtener clientes";
  }
}

// Crear nuevo cliente
async function crearCliente(nombre, apellidos, telefono, email) {
  try {
    const query = `
      INSERT INTO cliente (nombre, apellidos, telefono, email)
      VALUES (@param0, @param1, @param2, @param3)
    `;
    await executeQuery(query, [nombre, apellidos, telefono, email]);
    return "Cliente creado correctamente";
  } catch (error) {
    console.log("Error:", error);
    throw "Error al crear cliente";
  }
}

// Actualizar cliente existente
async function actualizarCliente(id, nombre, apellidos, telefono, email) {
  try {
    const query = `
      UPDATE cliente
      SET nombre = @param0, apellidos = @param1, telefono = @param2, email = @param3
      WHERE id = @param4
    `;
    await executeQuery(query, [nombre, apellidos, telefono, email, id]);
    return "Cliente actualizado correctamente";
  } catch (error) {
    console.log("Error:", error);
    throw "Error al actualizar cliente";
  }
}

// Eliminar cliente
async function eliminarCliente(id) {
  try {
    const query = "DELETE FROM cliente WHERE id = @param0";
    await executeQuery(query, [id]);
    return "Cliente eliminado correctamente";
  } catch (error) {
    console.log("Error:", error);
    throw "Error al eliminar cliente";
  }
}

// Crear nuevo registro de usuario
async function crearRegistro({ nombre, apellidos, telefono, usuario, contrasenia }) {
  try {
    // Verificar si el usuario ya existe
    const checkQuery = "SELECT id FROM usuario WHERE usuario = @param0";
    const checkResult = await executeQuery(checkQuery, [usuario]);

    if (checkResult.recordset.length > 0) {
      throw new Error('El usuario ya existe');
    }

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO usuario (nombre, apellidos, telefono, usuario, contrasenia)
      VALUES (@param0, @param1, @param2, @param3, @param4)
    `;
    await executeQuery(insertQuery, [nombre, apellidos, telefono, usuario, contrasenia]);

    // No hay `insertId`, pero puedes volver a buscar el usuario insertado
    const result = await executeQuery("SELECT TOP 1 * FROM usuario WHERE usuario = @param0", [usuario]);
    return result.recordset[0];
  } catch (error) {
    console.error('Error en crearRegistro:', error);
    throw error;
  }
}

// Buscar usuario por login
async function buscarUsuario(usuario, contrasenia) {
  try {
    const query = `
      SELECT id, nombre, apellidos, telefono, usuario, tipo_usuario
      FROM usuario
      WHERE usuario = @param0 AND contrasenia = @param1
    `;
    const result = await executeQuery(query, [usuario, contrasenia]);
    return result.recordset.length ? result.recordset[0] : null;
  } catch (error) {
    console.error('Error en buscarUsuario:', error);
    throw error;
  }
}

export default {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  buscarUsuario,
  crearRegistro,
};
