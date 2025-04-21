// .netlify/functions/getTasks.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Task } from "../../src/lib/models/Task";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta lawFirmCode" }) };
  }

  await connectDB();
  const tasks = await Task.find({ lawFirmCode }).sort({ createdAt: -1 }).lean();
  return {
    statusCode: 200,
    body: JSON.stringify({ tasks }),
  };
};
