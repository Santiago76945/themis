// netlify/functions/getUserEmailByUniqueCode.ts

import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("Debe definir MONGODB_URI en las variables de entorno.");

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(uri);
  isConnected = true;
};

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

const UserProfile =
  mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const { uniqueCode } = event.queryStringParameters || {};
    if (!uniqueCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El parámetro uniqueCode es requerido." }),
      };
    }

    const userProfile = await UserProfile.findOne({ uniqueCode });
    if (!userProfile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Usuario no encontrado." }),
      };
    }

    if (
      userProfile.registrationMethod === "apple" ||
      userProfile.registrationMethod === "google"
    ) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error:
            "Los usuarios que se registraron con Apple o Google deben iniciar sesión con su correo electrónico.",
        }),
      };
    }

    // Devolvemos nombre y apellido además de email
    return {
      statusCode: 200,
      body: JSON.stringify({
        email: userProfile.email,
        registrationMethod: userProfile.registrationMethod,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      }),
    };
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al obtener el perfil del usuario." }),
    };
  }
};
