// .netlify/functions/respondInvitation.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import { LawFirm } from '../../src/lib/models/LawFirm';
import { Invitation } from '../../src/lib/models/Invitation';

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { invitationId, response } = JSON.parse(event.body || '{}');
    if (!invitationId || !['accepted', 'rejected'].includes(response)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Datos inválidos' }) };
    }
    const inv = await Invitation.findById(invitationId);
    if (!inv || inv.status !== 'pending') {
      return { statusCode: 404, body: JSON.stringify({ error: 'Invitación no encontrada' }) };
    }
    inv.status = response as any;
    await inv.save();
    if (response === 'accepted') {
      const firm = await LawFirm.findOne({ code: inv.lawFirmCode });
      if (firm && !firm.members.includes(inv.invitedUserCode)) {
        firm.members.push(inv.invitedUserCode);
        await firm.save();
      }
    }
    return { statusCode: 200, body: JSON.stringify({ invitation: inv }) };
  } catch (error: any) {
    console.error('respondInvitation error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
