// netlify/functions/getUserProfile.ts

import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";
import { connectDB } from "../../src/lib/mongoose"; // Ajusta la ruta según tu estructura

// Esquema para el perfil de usuario
const userProfileSchema = new mongoose.Schema({
  uid: String,
  email: String,
  firstName: String,
  lastName: String,
  uniqueCode: String,
  registrationMethod: String,
}, { collection: "userProfiles" });

// Crea o reutiliza el modelo
const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export const handler: Handler = async (event, context) => {
  try {
    await connectDB();
    const { uid } = event.queryStringParameters || {};
    if (!uid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro uid es requerido" })
      };
    }
    const profile = await UserProfile.findOne({ uid: uid });
    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Perfil no encontrado" })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ profile })
    };
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al obtener el perfil" })
    };
  }
};
