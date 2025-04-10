// netlify/functions/db.ts
import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Debe definir MONGODB_URI en las variables de entorno.");
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(uri);
  isConnected = true;
};

export const handler: Handler = async (event, context) => {
  try {
    await connectDB();
    // Aquí se pueden implementar operaciones de lectura/escritura a la base de datos.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Conexión exitosa a MongoDB" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error conectando a MongoDB" }),
    };
  }
};
