// netlify/functions/modificarCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const { casoId, data, userCode, userName } = JSON.parse(event.body || "{}");
    if (!casoId || !data || !userCode || !userName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    await connectDB();

    const updated = await Caso.findByIdAndUpdate(casoId, data, { new: true });
    if (!updated) {
      return { statusCode: 404, body: JSON.stringify({ error: "Caso no encontrado" }) };
    }

    // Log
    await CasoLog.create({
      casoId,
      userCode,
      userName,
      action: `modificó caso (${casoId})`,
      timestamp: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ caso: updated }),
    };
  } catch (err: any) {
    console.error("modificarCaso error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al modificar caso" }),
    };
  }
};
