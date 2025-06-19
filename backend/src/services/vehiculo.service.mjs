import { executeQuery } from "../middlewares/db.mjs";

async function obtenerVehiculosPorUsuario(usuarioId) {
  try {
    const sql = `
      SELECT v.*, u.usuario as nombre_usuario 
      FROM vehiculos v 
      INNER JOIN usuario u ON v.usuario_id = u.id 
      WHERE v.usuario_id = @param0
      ORDER BY v.created_at DESC
    `;
    const result = await executeQuery(sql, [usuarioId]);
    return result.recordset; // ← CORREGIDO
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    throw new Error("Error al obtener vehículos");
  }
}

async function crearVehiculo({ placa, color, modelo, version, usuario_id }) {
  try {
    const sql = `
      INSERT INTO vehiculos (placa, color, modelo, version, usuario_id) 
      VALUES (@param0, @param1, @param2, @param3, @param4);
      SELECT SCOPE_IDENTITY() AS id;
    `;
    const result = await executeQuery(sql, [placa, color, modelo, version, usuario_id]);
    
    const id = result.recordset[0].id; // ← CORREGIDO

    return {
      id,
      placa,
      color,
      modelo,
      version,
      usuario_id
    };
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    throw error;
  }
}

async function actualizarVehiculo(id, { placa, color, modelo, version, usuario_id }) {
  try {
    const sql = `
      UPDATE vehiculos 
      SET placa = @param0, color = @param1, modelo = @param2, version = @param3 
      WHERE id = @param4 AND usuario_id = @param5
    `;
    const result = await executeQuery(sql, [placa, color, modelo, version, id, usuario_id]);

    if (result.rowsAffected[0] === 0) { // ← CORREGIDO
      throw new Error("Vehículo no encontrado o no pertenece al usuario");
    }

    return "Vehículo actualizado correctamente";
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
    throw new Error("Error al actualizar vehículo");
  }
}

async function eliminarVehiculo(id, usuarioId) {
  try {
    const sql = "DELETE FROM vehiculos WHERE id = @param0 AND usuario_id = @param1";
    const result = await executeQuery(sql, [id, usuarioId]);

    if (result.rowsAffected[0] === 0) { // ← CORREGIDO
      throw new Error("Vehículo no encontrado o no pertenece al usuario");
    }

    return "Vehículo eliminado correctamente";
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    throw new Error("Error al eliminar vehículo");
  }
}

export default {
  obtenerVehiculosPorUsuario,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
};
