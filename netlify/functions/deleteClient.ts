// ================================
// .netlify/functions/deleteClient.ts
// ================================
import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { Client } from '../../src/lib/models/Client';
import { ClientLog } from '../../src/lib/models/ClientLog';

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { lawFirmCode, userCode, id } = body;
    if (!lawFirmCode || !userCode || !id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos requeridos' }) };
    }
    await connectDB();
    const client = await Client.findOneAndDelete({ lawFirmCode, id });
    if (!client) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Cliente no encontrado' }) };
    }
    await ClientLog.create({
      lawFirmCode,
      clientId: id,
      userCode,
      action: `eliminó a ${client.name}`,
      timestamp: new Date().toLocaleString('sv')
    });
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err: any) {
    console.error('deleteClient error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
