// netlify/functions/getLogCasos.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async () => {
  try {
    await connectDB();

    // Traer todos los logs, más recientes primero
    const logs = await CasoLog.find({})
      .sort({ timestamp: -1 })
      .lean();

    // Dar formato a la respuesta
    const formatted = logs.map((l) => ({
      userCode: l.userCode,
      userName: l.userName,
      action: l.action,
      timestamp: l.timestamp,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: formatted }),
    };
  } catch (err: any) {
    console.error("getLogCasos error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al obtener logs" }),
    };
  }
};
