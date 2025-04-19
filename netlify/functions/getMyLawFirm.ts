// .netlify/functions/getMyLawFirm.ts

import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongoose';
import mongoose from 'mongoose';
import { LawFirm } from '../../src/lib/models/LawFirm';

// Tipos para documentos lean
interface LawFirmDoc {
  name: string;
  code: string;
  managerCode: string;
  members: string[];
}

interface UserProfileDoc {
  firstName: string;
  lastName: string;
  uniqueCode: string;
}

// Modelo de UserProfile para lean
const userProfileSchema = new mongoose.Schema(
  {
    firstName:  String,
    lastName:   String,
    uniqueCode: String,
  },
  { collection: 'userProfiles' }
);
const UserProfile =
  mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { userCode } = event.queryStringParameters || {};
    if (!userCode) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta userCode' }) };
    }

    // Buscamos el estudio al que pertenece el usuario
    const firm = await LawFirm.findOne({ members: userCode }).lean<LawFirmDoc>();
    if (!firm) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Estudio no encontrado' }) };
    }

    // Cargamos perfiles de cada miembro
    const members: UserProfileDoc[] = await UserProfile.find(
      { uniqueCode: { $in: firm.members } }
    )
      .select('firstName lastName uniqueCode')
      .lean<UserProfileDoc[]>();

    return {
      statusCode: 200,
      body: JSON.stringify({
        firm: {
          name:        firm.name,
          code:        firm.code,
          managerCode: firm.managerCode,
          members,
        },
      }),
    };
  } catch (error: any) {
    console.error('getMyLawFirm error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
