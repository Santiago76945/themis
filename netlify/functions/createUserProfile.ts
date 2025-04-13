// netlify/functions/createUserProfile.ts

import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";
import { connectDB } from "../../src/lib/mongoose"; // Ajusta la ruta según tu estructura

// Define el esquema para el perfil de usuario
const userProfileSchema = new mongoose.Schema({
  uid: String,
  email: String,
  firstName: String,
  lastName: String,
  uniqueCode: String,
  registrationMethod: String,
}, { collection: "userProfiles" });

// Crea el modelo (si ya existe, utiliza el existente)
const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export const handler: Handler = async (event, context) => {
  try {
    // Conecta a la base de datos
    await connectDB();
    
    // Parsear el body
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se envió información" }),
      };
    }
    
    const data = JSON.parse(event.body);
    
    // Crear el perfil de usuario
    const newUserProfile = new UserProfile(data);
    await newUserProfile.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Perfil creado con éxito", user: data.uid }),
    };
  } catch (error) {
    console.error("Error al crear perfil:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al crear perfil" }),
    };
  }
};
