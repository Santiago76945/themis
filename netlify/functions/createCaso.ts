// netlify/functions/createCaso.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { CasoLog } from "../../src/lib/models/CasoLog";

export const handler: Handler = async (event) => {
  try {
    const { clienteId, data, userCode, userName } = JSON.parse(event.body || "{}");
    if (!clienteId || !data || !userCode || !userName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos requeridos" }),
      };
    }

    await connectDB();

    // Creamos y guardamos el caso
    const caso = new Caso({
      clienteId,
      ...data,
      createdAt: new Date(),
    });
    await caso.save();

    // Convertimos el _id a string de forma segura
    const casoIdStr = String(caso._id);

    // Registramos en el log
    await CasoLog.create({
      casoId:   casoIdStr,
      userCode,
      userName,
      action:   `creó caso (${casoIdStr}) para cliente ${clienteId}`,
      timestamp: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ caso }),
    };
  } catch (err: any) {
    console.error("crearCaso error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al crear caso" }),
    };
  }
};
