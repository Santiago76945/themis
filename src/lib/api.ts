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

/**
 * Generic helper to call a Netlify Function and parse JSON.
 */
const callFn = async <T>(fn: string, opts?: RequestInit): Promise<T> => {
  const res = await fetch(`/.netlify/functions/${fn}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error en ${fn}: ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json() as Promise<T>;
};

/**
 * Obtiene los clientes para un estudio (lawFirmCode).
 * Si la función no existe o responde 404, devuelve [].
 */
export const getClientes = async (lawFirmCode: string): Promise<Cliente[]> => {
  try {
    const { clients } = await callFn<{ clients: Cliente[] }>(
      `getClients?lawFirmCode=${lawFirmCode}`
    );
    return clients;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("404")) {
      return [];
    }
    throw err;
  }
};

/**
 * Obtiene los abogados para un estudio (lawFirmCode).
 */
export const getAbogados = async (lawFirmCode: string): Promise<Abogado[]> => {
  const { abogados } = await callFn<{ abogados: Abogado[] }>(
    `getAbogados?lawFirmCode=${lawFirmCode}`
  );
  return abogados;
};

/**
 * Crea un nuevo caso asociado a un cliente.
 * Retorna la respuesta del servidor (por ejemplo, el objeto creado).
 */
export const crearCaso = (
  clienteId: string,
  data: CasoData,
  userCode: string,
  userName: string
): Promise<unknown> =>
  callFn<unknown>("crearCaso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, data, userCode, userName }),
  });

/**
 * Modifica un caso existente.
 */
export const modificarCaso = (
  casoId: string,
  data: CasoData,
  userCode: string,
  userName: string
): Promise<unknown> =>
  callFn<unknown>("modificarCaso", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, data, userCode, userName }),
  });

/**
 * Elimina un caso por su ID.
 */
export const eliminarCaso = (
  casoId: string,
  userCode: string,
  userName: string
): Promise<unknown> =>
  callFn<unknown>("eliminarCaso", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ casoId, userCode, userName }),
  });

/**
 * Raw shape of each log entry returned by el servidor.
 */
interface RawLog {
  userName: string;
  action: string;
  timestamp: string;
}

/**
 * Obtiene el log de acciones de casos y lo mapea a LogEntry.
 */
export const getLogCasos = async (): Promise<LogEntry[]> => {
  const { logs } = await callFn<{ logs: RawLog[] }>("getLogCasos");
  return logs.map(({ userName, action, timestamp }) => ({
    usuario: userName,
    accion: action,
    fecha: new Date(timestamp).toLocaleString("es-AR", {
      timeZone: "America/Argentina/Cordoba",
    }),
  }));
};
