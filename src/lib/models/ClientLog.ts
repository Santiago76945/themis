// ================================
// src/lib/models/ClientLog.ts
// ================================
import mongoose from 'mongoose';

export interface IClientLog {
  lawFirmCode: string;
  clientId: string;      // el campo `id` del cliente
  userCode: string;      // código del abogado que hizo la acción
  action: string;        // descripción breve
  timestamp: Date;
}

const ClientLogSchema = new mongoose.Schema<IClientLog>(
  {
    lawFirmCode: { type: String, required: true, index: true },
    clientId: { type: String, required: true },
    userCode: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, required: true }
  },
  { collection: 'clientlogs' }
);

ClientLogSchema.index({ lawFirmCode: 1, timestamp: -1 });

export const ClientLog =
  mongoose.models.ClientLog ||
  mongoose.model<IClientLog>('ClientLog', ClientLogSchema);
