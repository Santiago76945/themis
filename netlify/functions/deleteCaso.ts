// netlify/functions/deleteCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    // 1. Parseo y validación de entrada
    const { lawFirmCode, casoId, userCode, userName } = JSON.parse(event.body || "{}");
    if (!lawFirmCode || !casoId || !userCode || !userName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    // 2. Conexión a la base de datos
    await connectDB();
    console.log("✓ Conectado a MongoDB, borrando caso:", { lawFirmCode, casoId });

    // 3. Borrado del caso
    const deleted = await Caso.findOneAndDelete({ _id: casoId, lawFirmCode });
    if (!deleted) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Caso no encontrado" }),
      };
    }

    // 4. Logging de la operación
    await CasoLog.create({
      lawFirmCode,
      casoId,
      action: "eliminar",
      userCode,
      userName,
      timestamp: new Date(),
    });

    // 5. Respuesta exitosa
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
