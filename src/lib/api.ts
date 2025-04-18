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

export interface Abogado {
  id: string;
  nombre: string;
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
 * Obtiene los clientes para un estudio (lawFirmCode)
 */
export const getClientes = async (lawFirmCode: string): Promise<Cliente[]> => {
  try {
    const { clients } = await callFn(`getClients?lawFirmCode=${lawFirmCode}`);
    return clients;
  } catch (err: any) {
    // si no existe la función o retorna 404, devolvemos arreglo vacío
    if (err.message.includes("404")) return [];
    throw err;
  }
};

/**
 * Obtiene los abogados para un estudio (lawFirmCode)
 */
export const getAbogados = async (lawFirmCode: string): Promise<Abogado[]> => {
  const { abogados } = await callFn(`getAbogados?lawFirmCode=${lawFirmCode}`);
  return abogados;
};

/**
 * Crea un nuevo caso asociado a un cliente
 */
export const crearCaso = (clienteId: string, data: CasoData) =>
  callFn("crearCaso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, data }),
  });

/**
 * Modifica un caso existente
 */
export const modificarCaso = (casoId: string, data: CasoData) =>
  callFn("modificarCaso", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, data }),
  });

/**
 * Elimina un caso por su ID
 */
export const eliminarCaso = (casoId: string) =>
  callFn("eliminarCaso", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId }),
  });

/**
 * Obtiene el log de acciones de casos
 */
export const getLogCasos = (): Promise<LogEntry[]> =>
  callFn("getLogCasos");
