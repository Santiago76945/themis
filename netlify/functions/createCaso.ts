// netlify/functions/createCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const {
      lawFirmCode,
      clienteId,
      data,
      userCode,
      userName,
    } = JSON.parse(event.body || "{}");

    // Validaciones de campos obligatorios
    if (
      !lawFirmCode ||
      !clienteId ||
      !data ||
      !data.rol ||
      !data.caseType ||
      !data.referencia ||
      !data.prioridad ||
      !userCode ||
      !userName
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    await connectDB();

    // Crear caso con lawFirmCode incluido
    const caso = await Caso.create({
      lawFirmCode,
      clienteId,
      rol: data.rol,
      caseType: data.caseType,
      honorariosEstimados: data.honorariosEstimados,
      referencia: data.referencia,
      numeroExpediente: data.numeroExpediente,
      caratula: data.caratula,
      tribunal: data.tribunal,
      estado: data.estado,
      proximaTarea: data.proximaTarea,
      fechaProximaTarea: data.fechaProximaTarea,
      prioridad: data.prioridad,
      observaciones: data.observaciones,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Registrar en log
    await CasoLog.create({
      lawFirmCode,
      caseId: String(caso._id),
      userCode,
      userName,
      action: `creó caso “${data.referencia}”`,
      timestamp: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ caso }),
    };
  } catch (err: any) {
    console.error("createCaso error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al crear caso" }),
    };
  }
};
