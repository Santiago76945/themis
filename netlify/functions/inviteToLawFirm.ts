// .netlify/functions/inviteToLawFirm.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { LawFirm } from '../../src/lib/models/LawFirm';
import { Invitation } from '../../src/lib/models/Invitation';

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { lawFirmCode, invitedUserCode, managerCode } = JSON.parse(event.body || '{}');
    if (!lawFirmCode || !invitedUserCode || !managerCode) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos' }) };
    }
    const firm = await LawFirm.findOne({ code: lawFirmCode });
    if (!firm || firm.managerCode !== managerCode) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Sin permiso' }) };
    }
    // Evitar duplicados
    const exists = await Invitation.findOne({ lawFirmCode, invitedUserCode, status: 'pending' });
    if (exists) {
      return { statusCode: 409, body: JSON.stringify({ error: 'Invitación ya existe' }) };
    }
    const inv = new Invitation({ lawFirmCode, invitedUserCode });
    await inv.save();
    return { statusCode: 200, body: JSON.stringify({ invitation: inv }) };
  } catch (error: any) {
    console.error('inviteToLawFirm error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
