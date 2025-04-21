// src/lib/api/clients.ts

import { callFn } from "./utils";
import type { Cliente, ClientLogEntry } from "./types";

/**
 * Obtiene la lista de clientes de un estudio jurídico.
 */
export async function getClientes(lawFirmCode: string): Promise<Cliente[]> {
  try {
    const { clients } = await callFn<{ clients: Cliente[] }>(
      `getClients?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
    );
    return clients;
  } catch (err: any) {
    if (err.message.includes("404")) {
      return [];
    }
    throw err;
  }
}

/**
 * Crea un nuevo cliente.
 */
export async function createClient(
  data: Omit<Cliente, "createdAt" | "updatedAt">,
  userCode: string,
  userName: string
): Promise<Cliente> {
  const { client } = await callFn<{ client: Cliente }>("createClient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, userCode, userName }),
  });
  return client;
}

/**
 * Obtiene el log de operaciones sobre clientes.
 */
export async function getClientLog(
  lawFirmCode: string
): Promise<ClientLogEntry[]> {
  const { logs } = await callFn<{ logs: ClientLogEntry[] }>(
    `getClientLog?lawFirmCode=${encodeURIComponent(lawFirmCode)}`
  );
  return logs;
}
