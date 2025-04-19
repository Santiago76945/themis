// netlify/functions/healthcheck-db.ts

import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./db";

export const handler: Handler = async () => {
  try {
    await connectToDatabase();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Conexión exitosa a MongoDB" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error conectando a MongoDB" }),
    };
  }
};
