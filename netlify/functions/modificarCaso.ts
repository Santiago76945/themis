// .netlify/functions/modificarCaso.ts

import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./db";
import mongoose from "mongoose";

const CasoSchema = new mongoose.Schema({}, { collection: "casos" });
const LogSchema  = new mongoose.Schema({}, { collection: "logs"  });

const Caso = mongoose.models.Caso || mongoose.model("Caso", CasoSchema);
const Log  = mongoose.models.Log  || mongoose.model("Log",  LogSchema);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Método no permitido" };
  }
  await connectToDatabase();
  const { casoId, data } = JSON.parse(event.body!);
  await Caso.findByIdAndUpdate(casoId, data);
  await Log.create({
    usuario: data.responsables || "Desconocido",
    accion: `modificó el caso ${casoId}`,
    fecha: new Date(),
  });
  return { statusCode: 200, body: "OK" };
};
