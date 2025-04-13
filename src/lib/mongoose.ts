//src/lib.mongoose.ts

import mongoose from "mongoose";

// Verificar que la variable de entorno esté definida.
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI no está definida en las variables de entorno.");
}

// Aquí sabemos que MONGODB_URI tiene un valor seguro.
const uri: string = process.env.MONGODB_URI;

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    // En Mongoose 6 las opciones useNewUrlParser y useUnifiedTopology ya no son necesarias.
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState === 1;
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}
