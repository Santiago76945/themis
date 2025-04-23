// src/lib/api/tasks.ts

import { callFn } from "./utils";
import type { Task, TaskLogEntry } from "./types";

/**
 * Obtiene todas las tareas de un estudio (lawFirmCode).
 */
export async function getTasks(lawFirmCode: string): Promise<Task[]> {
  const { tasks } = await callFn<{ tasks: Task[] }>(
    `getTasks?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return tasks;
}

/**
 * Crea una nueva tarea.
 */
export function crearTask(
  task: Omit<Task, "_id" | "createdAt" | "updatedAt">,
  userCode: string,
  userName: string
): Promise<{ task: Task }> {
  return callFn<{ task: Task }>("createTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lawFirmCode: task.lawFirmCode,
      userCode,
      userName,
      task,
    }),
  });
}

/**
 * Modifica una tarea existente.
 * Ahora admite cualquier campo opcional, incluyendo `dependencies`.
 */
export function modificarTask(
  id: string,
  updates: Partial<
    Omit<
      Task,
      | "_id"
      | "lawFirmCode"
      | "createdBy"
      | "createdByName"
      | "createdAt"
      | "updatedAt"
    >
  >,
  userCode: string,
  userName: string,
  lawFirmCode: string
): Promise<{ task: Task }> {
  return callFn<{ task: Task }>("updateTask", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lawFirmCode,
      id,
      updates,
      userCode,
      userName,
    }),
  });
}

/**
 * Elimina una tarea por su ID.
 */
export function eliminarTask(
  id: string,
  lawFirmCode: string,
  userCode: string,
  userName: string
): Promise<{ success: boolean }> {
  return callFn<{ success: boolean }>("deleteTask", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lawFirmCode, id, userCode, userName }),
  });
}

/**
 * Obtiene el log de actividad de tareas de un estudio.
 */
export async function getTaskLog(
  lawFirmCode: string
): Promise<TaskLogEntry[]> {
  const { logs } = await callFn<{ logs: TaskLogEntry[] }>(
    `getTaskLog?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return logs;
}
