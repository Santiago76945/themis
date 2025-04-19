// netlify/functions/eliminarCaso.ts

import type { Handler } from "@netlify/functions";
import mongoose from "mongoose";
import { connectToDatabase } from "./db";

// Definición del esquema de Abogado
const abogadoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  lawFirmCode: String,
}, { collection: "abogados" });

// Modelo reutilizable si ya existe
const AbogadoModel = mongoose.models.Abogado || mongoose.model("Abogado", abogadoSchema);

export const handler: Handler = async (event) => {
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta lawFirmCode" }),
    };
  }

  // Conexión a la base de datos
  await connectToDatabase();

  // Búsqueda de abogados del estudio
  const docs = await AbogadoModel.find({ lawFirmCode }).lean();

  // Formateo de salida
  const abogados = docs.map((doc: any) => ({
    id: String(doc._id),
    nombre: `${doc.firstName} ${doc.lastName}`,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ abogados }),
  };
};
