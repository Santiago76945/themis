// netlify/functions/createCaso.ts

import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./db";
import mongoose from "mongoose";

const CasoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  referencia: String,
  numeroExpediente: String,
  prioridad: String,
  descripcion: String,
  tribunal: String,
  etapaProcesal: String,
  proximaAccion: String,
  fechaProximaAccion: Date,
  fechaInicioJuicio: Date,
  responsables: String,
}, { collection: "casos", timestamps: true });

const LogSchema = new mongoose.Schema({
  usuario: String,
  accion: String,
  fecha: Date,
}, { collection: "logs" });

const Caso = mongoose.models.Caso || mongoose.model("Caso", CasoSchema);
const Log  = mongoose.models.Log  || mongoose.model("Log",  LogSchema);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }
  await connectToDatabase();
  const { clienteId, data } = JSON.parse(event.body!);
  const nuevoCaso = await Caso.create({ cliente: clienteId, ...data });
  await Log.create({
    usuario: data.responsables || "Desconocido",
    accion: `creó el caso ${nuevoCaso._id}`,
    fecha: new Date(),
  });
  return {
    statusCode: 200,
    body: JSON.stringify(nuevoCaso),
  };
};
