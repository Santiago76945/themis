// netlify/functions/eliminarCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const { casoId, userCode, userName } = JSON.parse(event.body || "{}");
    if (!casoId || !userCode || !userName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    await connectDB();

    const deleted = await Caso.findByIdAndDelete(casoId);
    if (!deleted) {
      return { statusCode: 404, body: JSON.stringify({ error: "Caso no encontrado" }) };
    }

    // Log
    await CasoLog.create({
      casoId,
      userCode,
      userName,
      action: `eliminó caso (${casoId})`,
      timestamp: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Caso eliminado" }),
    };
  } catch (err: any) {
    console.error("eliminarCaso error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al eliminar caso" }),
    };
  }
};
