// netlify/functions/getClientLog.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { ClientLog } from '../../src/lib/models/ClientLog';

export const handler: Handler = async (event) => {
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Falta lawFirmCode' }) };
  }

  try {
    await connectDB();
    const raw = await ClientLog.find({ lawFirmCode }).sort({ timestamp: -1 }).limit(100);
    const logs = raw.map(l => ({
      usuario: l.userName,
      accion: l.action,
      fecha: l.timestamp,
    }));

    return { statusCode: 200, body: JSON.stringify({ logs }) };
  } catch (err: any) {
    console.error('getClientLog error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};