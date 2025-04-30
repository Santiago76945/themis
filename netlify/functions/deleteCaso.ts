// netlify/functions/deleteCaso.ts

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
    const caso = await Caso.findOneAndDelete({ _id: casoId });
    if (caso) {
      await CasoLog.create({
        lawFirmCode: caso.lawFirmCode,
        caseId: caso._id,
        userName,
        action: `eliminó caso “${caso.referencia}”`,
        timestamp: new Date(),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err: any) {
    console.error("deleteCaso error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al eliminar caso" }),
    };
  }
};
