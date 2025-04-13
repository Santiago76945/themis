// netlify/functions/createUserProfile.ts

import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";
import { connectDB } from "../../src/lib/mongoose"; // Ajusta la ruta según tu estructura

const userProfileSchema = new mongoose.Schema(
  {
    uid: String,
    email: String,
    firstName: String,
    lastName: String,
    uniqueCode: String,
    registrationMethod: String,
  },
  { collection: "userProfiles" }
);

const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export const handler: Handler = async (event, context) => {
  console.log("Inicio de createUserProfile function.");
  try {
    await connectDB();
    console.log("Conexión a MongoDB establecida.");
    if (!event.body) {
      console.error("No se recibió body en la solicitud.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se envió información" }),
      };
    }
    console.log("Recibiendo body:", event.body);
    const data = JSON.parse(event.body);
    console.log("Datos parseados:", data);
    const newUserProfile = new UserProfile(data);
    await newUserProfile.save();
    console.log("Perfil de usuario guardado correctamente:", newUserProfile);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Perfil creado con éxito", user: data.uid }),
    };
  } catch (error) {
    console.error("Error en createUserProfile:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al crear perfil" }),
    };
  }
};
