// .netlify/functions/getCasos.ts

import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./db";
import mongoose from "mongoose";
import { Caso } from "../../src/lib/models/Caso";
import { Client } from "../../src/lib/models/Client";

export const handler: Handler = async (event) => {
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta lawFirmCode" }),
    };
  }

  try {
    // Conectar a Mongo
    await connectToDatabase();

    // Obtener todos los clientes de este estudio
    const clientes = await Client.find({ lawFirmCode }).lean();
    const clientIds = clientes.map((c: any) => c.id);

    // Buscar todos los casos cuyo clienteId esté en clientIds
    const docs = await Caso.find({ clienteId: { $in: clientIds } })
      .sort({ createdAt: -1 })
      .lean();

    // Formatear fechas a strings ISO
    const casos = docs.map((c: any) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
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
