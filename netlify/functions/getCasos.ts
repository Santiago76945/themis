// .netlify/functions/getCasos.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";

export const handler: Handler = async (event) => {
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta lawFirmCode" }),
    };
  }

  try {
    await connectDB();
    // Solo los casos de este estudio
    const docs = await Caso.find({ lawFirmCode }).sort({ createdAt: -1 });
    const casos = docs.map((c) => ({
      _id: c._id,
      clienteId: c.clienteId,
      rol: c.rol,
      caseType: c.caseType,
      honorariosEstimados: c.honorariosEstimados,
      referencia: c.referencia,
      numeroExpediente: c.numeroExpediente,
      caratula: c.caratula,
      tribunal: c.tribunal,
      estado: c.estado,
      proximaTarea: c.proximaTarea,
      fechaProximaTarea: c.fechaProximaTarea,
      prioridad: c.prioridad,
      observaciones: c.observaciones,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({ casos }),
    };
  } catch (err: any) {
    console.error("getCasos error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al obtener casos" }),
    };
  }
};
