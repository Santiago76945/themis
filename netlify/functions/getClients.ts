// netlify/functions/getClients.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { Client } from '../../src/lib/models/Client';

export const handler: Handler = async (event) => {
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Falta lawFirmCode' }),
    };
  }
  try {
    await connectDB();
    const clients = await Client.find({ lawFirmCode })
      .sort({ createdAt: 1 })
      .lean();

    // Formatear la respuesta para exponer sólo los campos necesarios
    const formatted = clients.map(c => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      dni: c.dni,
      phone: c.phone,
      email: c.email,
      address: c.address,
      additionalInfo: c.additionalInfo || '',
      lawFirmCode: c.lawFirmCode,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ clients: formatted }),
    };
  } catch (err: any) {
    console.error('getClients error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno' }),
    };
  }
};
