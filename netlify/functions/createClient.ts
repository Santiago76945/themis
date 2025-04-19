// ================================
// .netlify/functions/createClient.ts
// ================================
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
    const { lawFirmCode, userCode, name, dni, phone, email, additionalInfo } = body;
    if (!lawFirmCode || !userCode || !name || !dni || !phone || !email) {
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
      name,
      dni,
      phone,
      email,
      additionalInfo
    });
    await client.save();

    // Log
    await ClientLog.create({
      lawFirmCode,
      clientId: nextId,
      userCode,
      action: `añadió a ${name}`,
      timestamp: new Date().toLocaleString('sv') /* ISO-like string, ajusta si quieres timezone */
    });

    return { statusCode: 200, body: JSON.stringify({ client }) };
  } catch (err: any) {
    console.error('createClient error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};