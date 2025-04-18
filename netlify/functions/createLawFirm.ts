// .netlify/functions/createLawFirm.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { LawFirm } from '../../src/lib/models/LawFirm';
import { generateUniqueCode } from '../../src/utils/generateCode';

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { name, managerCode } = JSON.parse(event.body || '{}');
    if (!name || !managerCode) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos' }) };
    }
    // Generar código único
    let code: string;
    do {
      code = generateUniqueCode();
    } while (await LawFirm.findOne({ code }));
    const doc = new LawFirm({
      name,
      code,
      managerCode,
      members: [managerCode],
    });
    await doc.save();
    return {
      statusCode: 200,
      body: JSON.stringify({ lawfirm: doc }),
    };
  } catch (error: any) {
    console.error('createLawFirm error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
