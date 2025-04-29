// src/lib/models/Client.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ClientDocument extends Document {
  id: string;
  lawFirmCode: string;
  name: string;
  dni?: string;
  phone?: string;
  email?: string;
  address?: string;
  dateOfAlta?: string;
  clientObservations?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<ClientDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    lawFirmCode: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    dni: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    address: {
      type: String
    },
    dateOfAlta: {
      type: String
    },
    clientObservations: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const Client =
  mongoose.models.Client ||
  mongoose.model<ClientDocument>('Client', ClientSchema);
