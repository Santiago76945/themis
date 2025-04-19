// netlify/functions/deleteClient.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { Client }    from '../../src/lib/models/Client';
import { ClientLog } from '../../src/lib/models/ClientLog';

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { lawFirmCode, userCode, userName, id } = body;

    if (!lawFirmCode || !userCode || !userName || !id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos requeridos' }) };
    }

    await connectDB();
    const client = await Client.findOneAndDelete({ lawFirmCode, id });
    if (!client) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Cliente no encontrado' }) };
    }

    const name = `${client.firstName} ${client.lastName}`;
    // Registrar eliminación en el log
    await ClientLog.create({
      lawFirmCode,
      clientId:  id,
      userName,
      action:    `eliminó al cliente ${name}`,
      timestamp: new Date()
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err: any) {
    console.error('deleteClient error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
