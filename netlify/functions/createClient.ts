// netlify/functions/createClient.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { Client } from '../../src/lib/models/Client';
import { ClientLog } from '../../src/lib/models/ClientLog';

function padId(num: number): string {
  return num.toString().padStart(2, '0');
}

export const handler: Handler = async (event) => {
  try {
    const { lawFirmCode, userCode, userName, data } = JSON.parse(event.body || '{}');

    if (!lawFirmCode || !userCode || !userName || !data.name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos requeridos' }) };
    }

    await connectDB();
    // Generar ID ascendente y único
    const last = await Client.findOne({ lawFirmCode }).sort({ createdAt: -1 });
    let nextNum = 1;
    if (last && !isNaN(parseInt(last.id, 10))) {
      nextNum = parseInt(last.id, 10) + 1;
    }
    const newId = padId(nextNum);

    const client = await Client.create({
      id: newId,
      lawFirmCode,
      name: data.name,
      dni: data.dni,
      phone: data.phone,
      email: data.email,
      address: data.address,
      dateOfAlta: data.dateOfAlta,
      clientObservations: data.clientObservations,
    });

    await ClientLog.create({
      lawFirmCode,
      clientId: client.id,
      userName,
      action: `creó al cliente ${data.name}`,
      timestamp: new Date(),
    });

    return { statusCode: 200, body: JSON.stringify({ client }) };
  } catch (err: any) {
    console.error('createClient error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};