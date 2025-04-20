// src/lib/models/Caso.ts

import mongoose, { Document, Model } from "mongoose";

/**
 * Interfaz TypeScript para un caso
 */
export interface ICaso extends Document {
  clienteId: string;
  referencia?: string;
  numeroExpediente?: string;
  prioridad?: "Alta" | "Media" | "Baja";
  descripcion?: string;
  tribunal?: string;
  etapaProcesal?: string;
  proximaAccion?: string;
  fechaProximaAccion?: Date;
  fechaInicioJuicio?: Date;
  responsables?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Definición del esquema de casos
 */
const casoSchema = new mongoose.Schema<ICaso>(
  {
    clienteId: {
      type: String,
      required: true,
    },
    referencia: String,
    numeroExpediente: String,
    prioridad: {
      type: String,
      enum: ["Alta", "Media", "Baja"],
    },
    descripcion: String,
    tribunal: String,
    etapaProcesal: String,
    proximaAccion: String,
    fechaProximaAccion: Date,
    fechaInicioJuicio: Date,
    responsables: String,
  },
  {
    timestamps: true,       // crea createdAt y updatedAt
    collection: "casos",
  }
);

/**
 * Exportación del modelo
 */
export const Caso: Model<ICaso> =
  (mongoose.models.Caso as Model<ICaso>) ||
  mongoose.model<ICaso>("Caso", casoSchema);
