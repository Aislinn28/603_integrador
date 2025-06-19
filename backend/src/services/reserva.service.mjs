import { executeQuery } from "../middlewares/db.mjs";

// Precios base para los servicios
const PRECIOS = {
  autolavado: {
    lavado_exterior: 50,
    lavado_interior: 40,
    encerado: 80,
    aspirado: 30,
    limpieza_llantas: 25,
    aromatizante: 15
  },
  estacionamiento: {
    por_hora: 15,
    tiempo_completo: 100
  }
};

async function obtenerReservasPorUsuario(usuarioId) {
  try {
    const sql = `
      SELECT 
        r.*,
        v.placa,
        v.color,
        v.modelo,
        v.version,
        ra.lavado_exterior,
        ra.lavado_interior,
        ra.encerado,
        ra.aspirado,
        ra.limpieza_llantas,
        ra.aromatizante,
        ra.subtotal as subtotal_autolavado,
        re.tipo_tarifa,
        re.horas_estimadas,
        re.hora_salida,
        re.subtotal as subtotal_estacionamiento
      FROM reservas r
      INNER JOIN vehiculos v ON r.vehiculo_id = v.id
      LEFT JOIN reservas_autolavado ra ON r.id = ra.reserva_id
      LEFT JOIN reservas_estacionamiento re ON r.id = re.reserva_id
      WHERE r.usuario_id = @param0
      ORDER BY r.created_at DESC
    `;
    const rows = await executeQuery(sql, [usuarioId]);
    return Promise.resolve(rows);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return Promise.reject("Error al obtener reservas");
  }
}

async function crearReserva({ usuario_id, vehiculo_id, fecha, hora, tipo_servicio, autolavado, estacionamiento }) {
  
  
  try {
    let total = 0;
    let subtotalAutolavado = 0;
    let subtotalEstacionamiento = 0;

    if (tipo_servicio === 'autolavado' || tipo_servicio === 'ambos') {
      subtotalAutolavado = calcularSubtotalAutolavado(autolavado);
      total += subtotalAutolavado;
    }

    if (tipo_servicio === 'estacionamiento' || tipo_servicio === 'ambos') {
      subtotalEstacionamiento = calcularSubtotalEstacionamiento(estacionamiento);
      total += subtotalEstacionamiento;
    }

    const sqlReserva = `
      INSERT INTO reservas (usuario_id, vehiculo_id, fecha, hora, tipo_servicio, total)
      VALUES (@param0, @param1, @param2, @param3, @param4, @param5);
      SELECT SCOPE_IDENTITY() as id;
    `;

    const resultReserva = await executeQuery(sqlReserva, [
      usuario_id, vehiculo_id, fecha, hora, tipo_servicio, 'pendiente', total
    ]);

    // ✅ CORREGIDO: obtener ID correctamente
    const reservaId = resultReserva?.recordset?.[0]?.id || resultReserva?.[0]?.id;
    if (!reservaId) {
      throw new Error("No se pudo obtener el ID de la reserva insertada.");
    }

    if (tipo_servicio === 'autolavado' || tipo_servicio === 'ambos') {
      const sqlAutolavado = `
        INSERT INTO reservas_autolavado 
        (reserva_id, lavado_exterior, lavado_interior, encerado, aspirado, limpieza_llantas, aromatizante, subtotal)
        VALUES (@param0, @param1, @param2, @param3, @param4, @param5, @param6, @param7)
      `;
      await executeQuery(sqlAutolavado, [
        reservaId,
        autolavado?.lavado_exterior || false,
        autolavado?.lavado_interior || false,
        autolavado?.encerado || false,
        autolavado?.aspirado || false,
        autolavado?.limpieza_llantas || false,
        autolavado?.aromatizante || false,
        subtotalAutolavado
      ]);
    }

    if (tipo_servicio === 'estacionamiento' || tipo_servicio === 'ambos') {
      const sqlEstacionamiento = `
        INSERT INTO reservas_estacionamiento 
        (reserva_id, tipo_tarifa, horas_estimadas, hora_salida, subtotal)
        VALUES (@param0, @param1, @param2, @param3, @param4)
      `;
      await executeQuery(sqlEstacionamiento, [
        reservaId,
        estacionamiento?.tipo_tarifa,
        estacionamiento?.horas_estimadas || null,
        estacionamiento?.hora_salida || null,
        subtotalEstacionamiento
      ]);
    }

    return Promise.resolve({
      id: reservaId,
      usuario_id,
      vehiculo_id,
      fecha,
      hora,
      tipo_servicio,
      total
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return Promise.reject(error);
  }
}

function calcularSubtotalAutolavado(autolavado = {}) {
  let subtotal = 0;
  if (autolavado.lavado_exterior) subtotal += PRECIOS.autolavado.lavado_exterior;
  if (autolavado.lavado_interior) subtotal += PRECIOS.autolavado.lavado_interior;
  if (autolavado.encerado) subtotal += PRECIOS.autolavado.encerado;
  if (autolavado.aspirado) subtotal += PRECIOS.autolavado.aspirado;
  if (autolavado.limpieza_llantas) subtotal += PRECIOS.autolavado.limpieza_llantas;
  if (autolavado.aromatizante) subtotal += PRECIOS.autolavado.aromatizante;
  return subtotal;
}

function calcularSubtotalEstacionamiento(estacionamiento = {}) {
  if (estacionamiento.tipo_tarifa === 'tiempo_completo') {
    return PRECIOS.estacionamiento.tiempo_completo;
  }
  const horas = estacionamiento.horas_estimadas || 1;
  return horas * PRECIOS.estacionamiento.por_hora;
}

async function actualizarEstadoReserva(reservaId, estado, usuarioId) {
  try {
    const sql = `
      UPDATE reservas 
      SET estado = @param0, updated_at = GETDATE() 
      WHERE id = @param1 AND usuario_id = @param2
    `;
    const result = await executeQuery(sql, [estado, reservaId, usuarioId]);

    if (result.affectedRows === 0) {
      return Promise.reject("Reserva no encontrada o no pertenece al usuario");
    }

    return Promise.resolve("Estado actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return Promise.reject("Error al actualizar estado de reserva");
  }
}

async function eliminarReserva(reservaId, usuarioId) {
  try {
    const sql = "DELETE FROM reservas WHERE id = @param0 AND usuario_id = @param1";
    const result = await executeQuery(sql, [reservaId, usuarioId]);

    if (result.affectedRows === 0) {
      return Promise.reject("Reserva no encontrada o no pertenece al usuario");
    }

    return Promise.resolve("Reserva eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    return Promise.reject("Error al eliminar reserva");
  }
}

async function obtenerReservasConfirmadas() {
  try {
    const sql = `
      SELECT 
        r.*,
        u.nombre AS nombre_usuario,
        u.apellidos AS apellidos_usuario,
        v.placa,
        v.color,
        v.modelo,
        v.version,
        ra.lavado_exterior,
        ra.lavado_interior,
        ra.encerado,
        ra.aspirado,
        ra.limpieza_llantas,
        ra.aromatizante,
        ra.subtotal AS autolavado_subtotal,
        re.tipo_tarifa AS estacionamiento_tipo_tarifa,
        re.horas_estimadas AS estacionamiento_horas_estimadas,
        re.hora_salida AS estacionamiento_hora_salida,
        re.subtotal AS estacionamiento_subtotal
      FROM reservas r
      INNER JOIN usuario u ON r.usuario_id = u.id
      INNER JOIN vehiculos v ON r.vehiculo_id = v.id
      LEFT JOIN reservas_autolavado ra ON r.id = ra.reserva_id
      LEFT JOIN reservas_estacionamiento re ON r.id = re.reserva_id
      WHERE r.estado = 'confirmada'
      ORDER BY r.created_at DESC
    `;
    const rows = await executeQuery(sql);
    return Promise.resolve(rows.recordset);
  } catch (error) {
    console.error("Error al obtener reservas confirmadas:", error);
    return Promise.reject("Error al obtener reservas confirmadas");
  }
}

async function actualizarEstadoReservaComoEmpleado(reservaId, estado) {
  try {
    const sql = `
      UPDATE reservas 
      SET estado = @param0, updated_at = GETDATE() 
      WHERE id = @param1
    `;
    const result = await executeQuery(sql, [estado, reservaId]);
    if (result.affectedRows === 0) {
      return Promise.reject("Reserva no encontrada");
    }
    return Promise.resolve("Estado actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar estado (empleado):", error);
    return Promise.reject("Error al actualizar estado de reserva");
  }
}

export default {
  obtenerReservasPorUsuario,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva,
  obtenerReservasConfirmadas,
  actualizarEstadoReservaComoEmpleado,
};
