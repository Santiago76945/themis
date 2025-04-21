// src/lib/models/TaskLog.ts

import mongoose, { Document, Model } from "mongoose";

export interface ITaskLog extends Document {
  taskId: string;
  lawFirmCode: string;
  userCode: string;
  userName: string;
  action: string;
  timestamp: Date;
}

const taskLogSchema = new mongoose.Schema<ITaskLog>(
  {
    taskId:      { type: String, required: true },
    lawFirmCode: { type: String, required: true, index: true },
    userCode:    { type: String, required: true },
    userName:    { type: String, required: true },
    action:      { type: String, required: true },
    timestamp:   { type: Date,   required: true, default: () => new Date() },
  },
  {
    collection: "tasklogs",
  }
);

taskLogSchema.index({ lawFirmCode: 1, timestamp: -1 });

export const TaskLog: Model<ITaskLog> =
  (mongoose.models.TaskLog as Model<ITaskLog>) ||
  mongoose.model<ITaskLog>("TaskLog", taskLogSchema);
