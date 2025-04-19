// netlify/functions/eliminarCaso.ts

import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./db";
import mongoose from "mongoose";

const CasoSchema = new mongoose.Schema({}, { collection: "casos" });
const LogSchema  = new mongoose.Schema({}, { collection: "logs"  });

const Caso = mongoose.models.Caso || mongoose.model("Caso", CasoSchema);
const Log  = mongoose.models.Log  || mongoose.model("Log",  LogSchema);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Método no permitido" };
  }
  await connectToDatabase();
  const { casoId } = JSON.parse(event.body!);
  await Caso.findByIdAndDelete(casoId);
  await Log.create({
    usuario: "Desconocido",
    accion: `eliminó el caso ${casoId}`,
    fecha: new Date(),
  });
  return { statusCode: 200, body: "OK" };
};
