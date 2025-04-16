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
  console.log("getUserProfile - Iniciando handler");
  try {
    console.log("getUserProfile - Conectando a MongoDB...");
    await connectDB();
    console.log("getUserProfile - Conexión a MongoDB establecida");

    const { uid } = event.queryStringParameters || {};
    console.log("getUserProfile - Parámetro uid recibido:", uid);

    if (!uid) {
      console.error("getUserProfile - No se recibió el parámetro uid");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro uid es requerido" })
      };
    }
    console.log("getUserProfile - Consultando perfil para uid:", uid);
    const profile = await UserProfile.findOne({ uid: uid });
    if (!profile) {
      console.error("getUserProfile - Perfil no encontrado para uid:", uid);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Perfil no encontrado" })
      };
    }
    console.log("getUserProfile - Perfil encontrado:", profile);
    return {
      statusCode: 200,
      body: JSON.stringify({ profile })
    };
  } catch (error) {
    console.error("getUserProfile - Error en handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al obtener el perfil" })
    };
  }
};
