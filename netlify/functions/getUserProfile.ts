// netlify/functions/getUserProfile.ts

import type { Handler } from '@netlify/functions';
import mongoose from 'mongoose';
import { connectDB } from '../../src/lib/mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    uid: String,
    email: String,
    firstName: String,
    lastName: String,
    uniqueCode: String,
    registrationMethod: String,
  },
  { collection: 'userProfiles' }
);

const UserProfile =
  mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);

export const handler: Handler = async (event) => {
  try {
    console.log('getUserProfile - Iniciando handler');
    await connectDB();
    console.log('getUserProfile - Conexión a MongoDB establecida');

    const { uid } = event.queryStringParameters || {};
    if (!uid) {
      console.error('getUserProfile - Parámetro uid faltante');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El parámetro uid es requerido' }),
      };
    }
    console.log('getUserProfile - Consultando perfil para uid:', uid);

    const profile = await UserProfile.findOne({ uid }).lean();
    if (!profile) {
      console.error('getUserProfile - Perfil no encontrado para uid:', uid);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Perfil no encontrado' }),
      };
    }
    console.log('getUserProfile - Perfil encontrado:', profile);

    return {
      statusCode: 200,
      body: JSON.stringify({ profile }),
    };
  } catch (error: any) {
    console.error('getUserProfile - Error en handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno al obtener el perfil' }),
    };
  }
};
