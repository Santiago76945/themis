// src/lib/api/cases.ts

import { callFn } from "./utils";
import type { Caso, CasoData, LogEntry } from "./types";

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
 *
 * Importante: `data` no debe llevar `clienteId` porque lo pasamos
 * como parámetro por separado.
 */
export function crearCaso(
  lawFirmCode: string,
  clienteId: string,
  data: Omit<CasoData, "clienteId">,
  userCode: string,
  userName: string
): Promise<{ caso: Caso }> {
  return callFn<{ caso: Caso }>("createCaso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lawFirmCode,
      clienteId,
      userCode,
      userName,
      // aquí sólo los campos de CasoData sin clienteId
      ...data,
    }),
  });
}

/**
 * Actualiza un caso existente.
 */
export function updateCaso(
  casoId: string,
  data: CasoData,
  userCode: string,
  userName: string
): Promise<{ caso: Caso }> {
  return callFn<{ caso: Caso }>("updateCaso", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, data, userCode, userName }),
  });
}

/**
 * Elimina un caso.
 */
export function deleteCaso(
  lawFirmCode: string,
  casoId: string,
  userCode: string,
  userName: string
): Promise<{ success: boolean }> {
  return callFn<{ success: boolean }>("deleteCaso", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lawFirmCode, casoId, userCode, userName }),
  });
}

/**
 * Obtiene el log de operaciones sobre casos.
 */
export async function getLogCasos(lawFirmCode: string): Promise<LogEntry[]> {
  const { logs } = await callFn<{ logs: LogEntry[] }>(
    `getLogCasos?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return logs;
}
