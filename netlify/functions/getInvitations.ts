// .netlify/functions/getInvitations.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { Invitation } from '../../src/lib/models/Invitation';

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { userCode } = event.queryStringParameters || {};
    if (!userCode) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta userCode' }) };
    }
    const invites = await Invitation.find({
      invitedUserCode: userCode,
      status: 'pending',
    });
    return { statusCode: 200, body: JSON.stringify({ invites }) };
  } catch (error: any) {
    console.error('getInvitations error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
