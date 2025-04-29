// netlify/functions/updateClient.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { Client } from '../../src/lib/models/Client';
import { ClientLog } from '../../src/lib/models/ClientLog';

export const handler: Handler = async (event) => {
  try {
    const { lawFirmCode, userCode, userName, id, data } = JSON.parse(event.body || '{}');

    if (!lawFirmCode || !userCode || !userName || !id || !data) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos requeridos' }) };
    }

    await connectDB();
    const client = await Client.findOneAndUpdate(
      { lawFirmCode, id },
      { $set: data },
      { new: true }
    );
    if (!client) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Cliente no encontrado' }) };
    }

    await ClientLog.create({
      lawFirmCode,
      clientId: client.id,
      userName,
      action: `modificó al cliente ${client.name}`,
      timestamp: new Date(),
    });

    return { statusCode: 200, body: JSON.stringify({ client }) };
  } catch (err: any) {
    console.error('updateClient error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
