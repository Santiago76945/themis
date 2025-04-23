// .netlify/functions/updateTask.ts

import type { Handler } from "@netlify/functions";
import { connectDB } from "../../src/lib/mongoose";
import { Task } from "../../src/lib/models/Task";
import { TaskLog } from "../../src/lib/models/TaskLog";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const { lawFirmCode, id, updates, userCode, userName } = JSON.parse(event.body || "{}");
  if (!lawFirmCode || !id || !userCode || !userName) {
    return { statusCode: 400, body: JSON.stringify({ error: "Faltan parámetros requeridos" }) };
  }

  await connectDB();

  // Aplica los cambios, incluyendo `dependencies` si viene en updates
  const updated = await Task.findOneAndUpdate(
    { _id: id, lawFirmCode },
    { $set: updates },
    { new: true }
  );
  if (!updated) {
    return { statusCode: 404, body: JSON.stringify({ error: "Tarea no encontrada" }) };
  }

  // Registra el log
  await TaskLog.create({
    taskId: String(updated._id),
    lawFirmCode,
    userCode,
    userName,
    action: `modificó la tarea "${updated.name}"`,
    timestamp: new Date(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ task: updated }),
  };
};
