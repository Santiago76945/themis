// ================================
// src/lib/models/Client.ts
// ================================
import mongoose from 'mongoose';

export interface IClient {
  lawFirmCode: string;
  id: string;              // "01", "02", ...
  name: string;
  dni: string;
  phone: string;
  email: string;
  additionalInfo?: string;
  createdAt: Date;
}

const ClientSchema = new mongoose.Schema<IClient>(
  {
    lawFirmCode: { type: String, required: true, index: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    dni: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    additionalInfo: { type: String },
  },
  {
    collection: 'clients',
    timestamps: { createdAt: 'createdAt', updatedAt: false }
  }
);

// Índice único por estudio + id
ClientSchema.index({ lawFirmCode: 1, id: 1 }, { unique: true });

export const Client =
  mongoose.models.Client ||
  mongoose.model<IClient>('Client', ClientSchema);