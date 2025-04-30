// netlify/functions/deleteCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const { lawFirmCode, casoId, userCode, userName } = JSON.parse(event.body || "{}");

    if (!lawFirmCode || !casoId || !userCode || !userName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    await connectDB();

    // Eliminación (soft delete o hard delete según esquema)
    await Caso.deleteOne({ _id: casoId, lawFirmCode });

    // Log de la eliminación
    await CasoLog.create({
      lawFirmCode,
      caseId: casoId,
      userCode,
      userName,
      action: `eliminó caso ID ${casoId}`,
      timestamp: new Date(),
    });

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
