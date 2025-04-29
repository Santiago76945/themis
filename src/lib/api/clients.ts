// src/lib/api/clients.ts

import { callFn } from "./utils";
import type { Cliente, LogEntry } from "./types";

/**
 * Obtiene la lista de clientes de un estudio jurídico.
 */
export async function getClientes(lawFirmCode: string): Promise<Cliente[]> {
  const { clients } = await callFn<{ clients: Cliente[] }>(
    `getClients?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return clients;
}

/**
 * Crea un nuevo cliente.
 */
export async function createClient(
  lawFirmCode: string,
  data: Omit<Cliente, "createdAt" | "updatedAt">,
  userCode: string,
  userName: string
): Promise<Cliente> {
  const { client } = await callFn<{ client: Cliente }>("createClient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lawFirmCode, userCode, userName, data }),
  });
  return client;
}

/**
 * Obtiene el log de operaciones sobre clientes.
 */
export async function getClientLog(
  lawFirmCode: string
): Promise<LogEntry[]> {
  const { logs } = await callFn<{ logs: LogEntry[] }>(
    `getClientLog?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return logs;
}
