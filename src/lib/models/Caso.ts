// src/lib/models/Caso.ts

import mongoose, { Document, Schema } from "mongoose";

export interface CasoDocument extends Document {
  lawFirmCode: string;
  clienteId: string;
  rol: string;
  caseType: "propio" | "delegado";
  honorariosEstimados?: number;
  referencia: string;
  numeroExpediente?: string;
  caratula?: string;
  tribunal?: string;
  estado?: string;
  proximaTarea?: string;
  fechaProximaTarea?: string;
  prioridad: "Alta" | "Media" | "Baja";
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CasoSchema = new Schema<CasoDocument>(
  {
    lawFirmCode: { type: String, required: true },
    clienteId: { type: String, required: true },
    rol: { type: String, required: true },
    caseType: {
      type: String,
      enum: ["propio", "delegado"],
      required: true,
    },
    honorariosEstimados: { type: Number },
    referencia: { type: String, required: true },
    numeroExpediente: { type: String },
    caratula: { type: String },
    tribunal: { type: String },
    estado: { type: String },
    proximaTarea: { type: String },
    fechaProximaTarea: { type: String },
    prioridad: {
      type: String,
      enum: ["Alta", "Media", "Baja"],
      required: true,
    },
    observaciones: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Caso =
  mongoose.models.Caso || mongoose.model<CasoDocument>("Caso", CasoSchema);
