// netlify/functions/updateCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const { casoId, data, userCode, userName } = JSON.parse(event.body || "{}");
    if (
      !casoId ||
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
    const caso = await Caso.findOneAndUpdate(
      { _id: casoId },
      {
        $set: {
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
        },
      },
      { new: true }
    );
    if (!caso) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Caso no encontrado" }),
      };
    }

    await CasoLog.create({
      lawFirmCode: caso.lawFirmCode,
      caseId: caso._id,
      userName,
      action: `modificó caso “${data.referencia}”`,
      timestamp: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ caso }),
    };
  } catch (err: any) {
    console.error("updateCaso error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al modificar caso" }),
    };
  }
};
