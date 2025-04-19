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
    const body = JSON.parse(event.body || '{}');
    const { lawFirmCode, userCode, firstName, lastName, dni, phone, email, address, additionalInfo } = body;

    if (!lawFirmCode || !userCode || !firstName || !lastName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos requeridos' }) };
    }

    await connectDB();

    // Calcular próximo ID
    const last = await Client.find({ lawFirmCode })
      .sort({ createdAt: -1 })
      .limit(1);
    const nextId = last.length
      ? padId(Number(last[0].id) + 1)
      : padId(1);

    const client = new Client({
      lawFirmCode,
      id: nextId,
      firstName,
      lastName,
      dni,
      phone,
      email,
      address,
      additionalInfo
    });
    await client.save();

    // Log de la creación
    await ClientLog.create({
      lawFirmCode,
      clientId: nextId,
      userCode,
      action: `añadió a ${firstName} ${lastName}`,
      timestamp: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' })
    });

    return { statusCode: 200, body: JSON.stringify({ client }) };
  } catch (err: any) {
    console.error('createClient error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
