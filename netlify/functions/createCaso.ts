// netlify/functions/createCaso.ts

import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";
import { Client } from "../../src/lib/models/Client";

export const handler: Handler = async (event) => {
  console.log("createCaso · body:", event.body);

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Body vacío" }),
      };
    }

    // 1. Parsear payload y unificar data anidada o plana
    const payload = JSON.parse(event.body);
    const {
      lawFirmCode,
      userCode,
      userName,
      clienteId,
      data, // por si aún llega anidado
      // campos al nivel raíz
      rol: _rol,
      caseType: _caseType,
      honorariosEstimados: _honorarios,
      referencia: _referencia,
      numeroExpediente: _numeroExpediente,
      caratula: _caratula,
      tribunal: _tribunal,
      estado: _estado,
      proximaTarea: _proximaTarea,
      fechaProximaTarea: _fechaProximaTarea,
      prioridad: _prioridad,
      observaciones: _observaciones,
    } = payload;

    // Si vino anidado en `data`, lo usamos; si no, usamos las variables planas
    const {
      rol = _rol,
      caseType = _caseType,
      honorariosEstimados = _honorarios,
      referencia = _referencia,
      numeroExpediente = _numeroExpediente,
      caratula = _caratula,
      tribunal = _tribunal,
      estado = _estado,
      proximaTarea = _proximaTarea,
      fechaProximaTarea = _fechaProximaTarea,
      prioridad = _prioridad,
      observaciones = _observaciones,
    } = data || {};

    // 2. Validación de campos obligatorios
    if (
      !lawFirmCode ||
      !userCode ||
      !userName ||
      !clienteId ||
      !rol ||
      !caseType ||
      !referencia ||
      !prioridad
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    // 3. Conectar a la base de datos
    await connectDB();
    console.log("createCaso · Conectado a MongoDB");

    // 4. Validar formato de clienteId
    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "clienteId inválido" }),
      };
    }

    // 5. Buscar cliente
    const cliente = await Client.findOne({ _id: clienteId, lawFirmCode });
    if (!cliente) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Cliente no encontrado" }),
      };
    }

    // 6. Parsear honorariosEstimados y fecha
    let parsedHonorarios: number | undefined;
    if (honorariosEstimados != null) {
      parsedHonorarios = Number(honorariosEstimados);
      if (isNaN(parsedHonorarios)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "honorariosEstimados debe ser un número válido",
          }),
        };
      }
    }

    let parsedFecha: Date | undefined;
    if (fechaProximaTarea) {
      parsedFecha = new Date(fechaProximaTarea);
      if (isNaN(parsedFecha.getTime())) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "fechaProximaTarea debe ser una fecha válida (YYYY-MM-DD)",
          }),
        };
      }
    }

    // 7. Crear el caso
    const nuevoCaso = await Caso.create({
      lawFirmCode,
      clienteId,
      clienteNombre: cliente.name,
      rol,
      caseType,
      honorariosEstimados: parsedHonorarios,
      referencia,
      numeroExpediente,
      caratula,
      tribunal,
      estado,
      proximaTarea,
      fechaProximaTarea: parsedFecha,
      prioridad,
      observaciones,
      createdBy: userCode,
    });
    console.log("createCaso · Caso creado:", nuevoCaso._id);

    // 8. Log de auditoría
    await CasoLog.create({
      lawFirmCode,
      casoId: nuevoCaso._id,
      action: "crear",
      userCode,
      userName,
      timestamp: new Date(),
    });

    // 9. Responder con el nuevo caso
    return {
      statusCode: 200,
      body: JSON.stringify(nuevoCaso),
    };
  } catch (err: any) {
    console.error("createCaso error:", err);

    // Manejar errores de validación de Mongoose
    if (err.name === "ValidationError") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: err.message }),
      };
    }

    // Cualquier otro error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al crear caso" }),
    };
  }
};
