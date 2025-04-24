// src/lib/api/cases.ts

import { callFn } from "./utils";
import { Caso, CasoData, LogEntry } from "./types";

/**
 * Obtiene todos los casos de un estudio.
 */
export async function getCasos(lawFirmCode: string): Promise<Caso[]> {
  const { casos } = await callFn<{ casos: Caso[] }>(
    `getCasos?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return casos;
}

/**
 * Crea un nuevo caso.
 */
export function crearCaso(
  clienteId: string,
  data: CasoData,
  userCode: string,
  userName: string
): Promise<{ caso: Caso }> {
  return callFn<{ caso: Caso }>("createCaso", {           // ← aquí
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, data, userCode, userName }),
  });
}

/**
 * Modifica un caso existente.
 */
export function modificarCaso(
  casoId: string,
  data: CasoData,
  userCode: string,
  userName: string
): Promise<{ caso: Caso }> {
  return callFn<{ caso: Caso }>("modificarCaso", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, data, userCode, userName }),
  });
}

/**
 * Elimina un caso por su ID.
 */
export function eliminarCaso(
  casoId: string,
  userCode: string,
  userName: string
): Promise<{ success: boolean }> {
  return callFn<{ success: boolean }>("eliminarCaso", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, userCode, userName }),
  });
}

/**
 * Obtiene el log de operaciones sobre casos.
 */
export async function getLogCasos(): Promise<LogEntry[]> {
  const { logs } = await callFn<{ logs: LogEntry[] }>("getLogCasos");
  return logs;
}
