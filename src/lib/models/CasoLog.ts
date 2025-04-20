// src/lib/models/CasoLog.ts

import mongoose, { Document, Model } from "mongoose";

// Interfaz TypeScript para un registro de log de casos
export interface ICasoLog extends Document {
  casoId: string;
  userCode: string;
  userName: string;
  action: string;
  timestamp: Date;
}

// Definición del esquema de log de casos
const casoLogSchema = new mongoose.Schema<ICasoLog>(
  {
    casoId:    { type: String, required: true },
    userCode:  { type: String, required: true },
    userName:  { type: String, required: true },
    action:    { type: String, required: true },
    timestamp: { type: Date,   required: true, default: () => new Date() },
  },
  {
    collection: "casoLogs",
  }
);

// Exportación del modelo, reutilizando la existente si ya fue compilada
export const CasoLog: Model<ICasoLog> =
  (mongoose.models.CasoLog as Model<ICasoLog>) ||
  mongoose.model<ICasoLog>("CasoLog", casoLogSchema);
