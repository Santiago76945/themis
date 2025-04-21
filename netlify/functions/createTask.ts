// .netlify/functions/createTask.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Task } from "../../src/lib/models/Task";
import { TaskLog } from "../../src/lib/models/TaskLog";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  const { lawFirmCode, userCode, userName, task } = JSON.parse(event.body || "{}");
  if (!lawFirmCode || !userCode || !userName || !task?.name) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan parámetros requeridos" }) };
  }

  await connectDB();
  const created = await Task.create({ ...task, lawFirmCode });

  await TaskLog.create({
    taskId: String(created._id),
    lawFirmCode,
    userCode,
    userName,
    action: `creó la tarea "${created.name}"`,
    timestamp: new Date(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ task: created }),
  };
};
