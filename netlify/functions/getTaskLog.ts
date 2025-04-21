// .netlify/functions/getTaskLog.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { TaskLog } from "../../src/lib/models/TaskLog";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  const { lawFirmCode } = event.queryStringParameters || {};
  if (!lawFirmCode) {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta lawFirmCode" }) };
  }

  await connectDB();
  const logs = await TaskLog.find({ lawFirmCode })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

  return {
    statusCode: 200,
    body: JSON.stringify({ logs }),
  };
};
