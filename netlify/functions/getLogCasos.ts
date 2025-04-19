// .netlify/functions/getLogCasos.ts

import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./db";
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  usuario: String,
  accion: String,
  fecha: Date,
}, { collection: "logs" });

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

export const handler: Handler = async () => {
  await connectToDatabase();
  const logs = await Log.find()
    .sort({ fecha: -1 })
    .lean();
  return {
    statusCode: 200,
    body: JSON.stringify(logs),
  };
};
