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
    const {
      lawFirmCode,
      userCode,
      userName,
      firstName,
      lastName,
      dni,
      phone,
      email,
      address,
      additionalInfo,
    } = JSON.parse(event.body || '{}');

    if (!lawFirmCode || !userCode || !userName || !firstName || !lastName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Faltan datos requeridos: lawFirmCode, userCode, userName, firstName, lastName',
        }),
      };
    }

    await connectDB();

    // Calcular próximo ID secuencial dentro del estudio
    const last = await Client.find({ lawFirmCode })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();
    const nextNum = last.length ? Number(last[0].id) + 1 : 1;
    const nextId = padId(nextNum);

    const client = new Client({
      lawFirmCode,
      id: nextId,
      userCode,
      firstName,
      lastName,
      dni,
      phone,
      email,
      address,
      additionalInfo,
    });
    await client.save();

    // Registrar acción en el log
    await ClientLog.create({
      lawFirmCode,
      clientId: nextId,
      userName,
      action: `añadió al cliente ${firstName} ${lastName}`,
      timestamp: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ client }),
    };
  } catch (err: any) {
    console.error('createClient error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno' }),
    };
  }
};
