// .netlify/functions/getMyLawFirm.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { LawFirm } from '../../src/lib/models/LawFirm';

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { userCode } = event.queryStringParameters || {};
    if (!userCode) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta userCode' }) };
    }
    const firm = await LawFirm.findOne({ members: userCode });
    return { statusCode: 200, body: JSON.stringify({ firm }) };
  } catch (error: any) {
    console.error('getMyLawFirm error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
