// netlify/functions/db.ts

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error("Debe definir MONGODB_URI en las variables de entorno.");
}

let conn: Promise<typeof mongoose> | null = null;

/**
 * Conecta a MongoDB (usa cached connection en entorno serverless)
 */
export const connectToDatabase = (): Promise<typeof mongoose> => {
  if (!conn) {
    conn = mongoose.connect(uri, {
      // Aquí puedes agregar opciones de mongoose si las necesitas
    });
  }
  return conn;
};
