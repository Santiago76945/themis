// src/lib/models/Task.ts

import mongoose, { Document, Model } from "mongoose";

export interface IAttachment {
  url: string;
  description: string;
}

export interface IDependency {
  taskId: string;
  type: "retraso" | "espera";
}

export interface IComment {
  userCode: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface ITask extends Document {
  lawFirmCode: string;
  name: string;
  description?: string;
  clienteId?: string;
  numeroExpediente?: string;
  prioridadProcesal: "Alta" | "Media" | "Baja";
  prioridadComercial: "Alta" | "Media" | "Baja";
  principalResponsables: string[];
  coResponsables: string[];
  dependencies: IDependency[];
  deadline?: Date;
  attachments: IAttachment[];
  estimatedTime?: string;
  comments: IComment[];
  estado: "pendiente" | "comenzada" | "finalizada";
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    lawFirmCode:           { type: String, required: true, index: true },
    name:                  { type: String, required: true },
    description:           { type: String },
    clienteId:             { type: String },
    numeroExpediente:      { type: String },
    prioridadProcesal:     { type: String, enum: ["Alta","Media","Baja"], required: true },
    prioridadComercial:    { type: String, enum: ["Alta","Media","Baja"], required: true },
    principalResponsables: { type: [String], default: [] },
    coResponsables:        { type: [String], default: [] },
    dependencies: [{
      taskId: { type: String, required: true },
      type:   { type: String, enum: ["retraso","espera"], required: true },
    }],
    deadline:        { type: Date },
    attachments: [{
      url:         { type: String, required: true },
      description: { type: String, required: true },
    }],
    estimatedTime:   { type: String },
    comments: [{
      userCode:  { type: String, required: true },
      userName:  { type: String, required: true },
      text:      { type: String, required: true },
      timestamp: { type: Date,   default: () => new Date() },
    }],
    estado:          { type: String, enum: ["pendiente","comenzada","finalizada"], default: "pendiente" },
    createdBy:       { type: String, required: true },
    createdByName:   { type: String, required: true },
  },
  {
    timestamps: true,    // genera createdAt y updatedAt
    collection: "tasks",
  }
);

export const Task: Model<ITask> =
  (mongoose.models.Task as Model<ITask>) ||
  mongoose.model<ITask>("Task", taskSchema);
