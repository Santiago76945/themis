// netlify/functions/createCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const { clienteId, data, userCode, userName } = JSON.parse(event.body || "{}");
    // Validaciones de campos obligatorios
    if (
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
    const caso = await Caso.create({
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
      lawFirmCode: data.lawFirmCode,      // si tu esquema lo incluye
    });

    await CasoLog.create({
      lawFirmCode: caso.lawFirmCode,
      caseId: caso._id,
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
