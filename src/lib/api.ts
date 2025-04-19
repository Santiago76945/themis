// src/lib/api.ts

export interface Cliente {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  address: string;
  additionalInfo?: string;
  lawFirmCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CasoData {
  referencia?: string;
  numeroExpediente?: string;
  prioridad?: "Alta" | "Media" | "Baja";
  descripcion?: string;
  tribunal?: string;
  etapaProcesal?: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
  fechaInicioJuicio?: string;
  responsables?: string;
}

export interface LogEntry {
  usuario: string;
  accion: string;
  fecha: string;
}

const callFn = async (fn: string, opts?: RequestInit) => {
  const res = await fetch(`/.netlify/functions/${fn}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error en ${fn}: ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json();
};

/**
 * Ahora getClientes recibe el código del estudio (lawFirmCode)
 */
export const getClientes = async (lawFirmCode: string): Promise<Cliente[]> => {
  try {
    const { clients } = await callFn(`getClients?lawFirmCode=${lawFirmCode}`);
    return clients;
  } catch (err: any) {
    if (err.message.includes("404")) return [];
    throw err;
  }
};

export const crearCaso = (clienteId: string, data: CasoData) =>
  callFn("crearCaso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, data }),
  });

export const modificarCaso = (casoId: string, data: CasoData) =>
  callFn("modificarCaso", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, data }),
  });

export const eliminarCaso = (casoId: string) =>
  callFn("eliminarCaso", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId }),
  });

export const getLogCasos = () =>
  callFn("getLogCasos").then((json) => json);
