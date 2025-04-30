// netlify/functions/getClients.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
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
    await connectDB();
    // Traemos todos los documentos de clientes
    const docs = await Client.find({ lawFirmCode }).sort({ name: 1 });

    // Mapear usando _id.toString() para que el front reciba un ObjectId válido
    const clients = docs.map((c) => ({
      id: c._id.toString(),    // ← aquí el cambio clave
      name: c.name,
      dni: c.dni,
      phone: c.phone,
      email: c.email,
      address: c.address,
      dateOfAlta: c.dateOfAlta,
      clientObservations: c.clientObservations,
      lawFirmCode: c.lawFirmCode,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ clients }),
    };
  } catch (err: any) {
    console.error("getClients error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
};
