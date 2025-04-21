// .netlify/functions/deleteTask.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Task } from "../../src/lib/models/Task";
import { TaskLog } from "../../src/lib/models/TaskLog";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  const { lawFirmCode, userCode, userName, id } = JSON.parse(event.body || "{}");
  if (!lawFirmCode || !userCode || !userName || !id) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan parámetros requeridos" }) };
  }

  await connectDB();
  const task = await Task.findOneAndDelete({ lawFirmCode, _id: id });
  if (!task) {
    return { statusCode: 404, body: JSON.stringify({ error: "Tarea no encontrada" }) };
  }

  await TaskLog.create({
    taskId: id,
    lawFirmCode,
    userCode,
    userName,
    action: `eliminó la tarea "${task.name}"`,
    timestamp: new Date(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
