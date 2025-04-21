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
 * Ahora invoca la función `createCaso.ts`.
 */
export const crearCaso = (
  clienteId: string,
  data: CasoData,
  userCode: string,
  userName: string
): Promise<unknown> =>
  callFn<unknown>("createCaso", {
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

// ──────────────────────────────────────────────────────────────────────────────
// Gestión de tareas
// ──────────────────────────────────────────────────────────────────────────────

export interface Task {
  _id: string;
  lawFirmCode: string;
  name: string;
  description?: string;
  clienteId?: string;
  numeroExpediente?: string;
  prioridadProcesal: "Alta" | "Media" | "Baja";
  prioridadComercial: "Alta" | "Media" | "Baja";
  principalResponsables: string[];
  coResponsables: string[];
  dependencies: { taskId: string; type: "retraso" | "espera" }[];
  deadline?: string;
  attachments: { url: string; description: string }[];
  estimatedTime?: string;
  comments: { userCode: string; userName: string; text: string; timestamp: string }[];
  estado: "pendiente" | "comenzada" | "finalizada";
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskLogEntry {
  taskId: string;
  lawFirmCode: string;
  userCode: string;
  userName: string;
  action: string;
  timestamp: string;
}

// Raw shape returned by el servidor
type RawTask = Omit<Task, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const getTasks = async (lawFirmCode: string): Promise<Task[]> => {
  const { tasks: raw } = await callFn<{ tasks: RawTask[] }>(
    `getTasks?lawFirmCode=${lawFirmCode}`
  );
  return raw as Task[];
};

export const crearTask = (
  task: Omit<Task, "_id" | "createdAt" | "updatedAt">,
  userCode: string,
  userName: string
): Promise<{ task: Task }> =>
  callFn<{ task: Task }>("createTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lawFirmCode: task.lawFirmCode,
      userCode,
      userName,
      task,
    }),
  });

export const modificarTask = (
  id: string,
  updates: Partial<Omit<Task, "_id" | "lawFirmCode" | "createdBy" | "createdByName" | "createdAt" | "updatedAt">>,
  userCode: string,
  userName: string,
  lawFirmCode: string
): Promise<{ task: Task }> =>
  callFn<{ task: Task }>("updateTask", {
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

export const eliminarTask = (
  id: string,
  lawFirmCode: string,
  userCode: string,
  userName: string
): Promise<{ success: boolean }> =>
  callFn<{ success: boolean }>("deleteTask", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lawFirmCode, id, userCode, userName }),
  });

export const getTaskLog = async (lawFirmCode: string): Promise<TaskLogEntry[]> => {
  const { logs } = await callFn<{ logs: TaskLogEntry[] }>(
    `getTaskLog?lawFirmCode=${lawFirmCode}`
  );
  return logs;
};


// al final de src/lib/api.ts, tras getLogCasos…

export interface Caso {
  _id: string;
  clienteId: string;
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
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtiene los casos para un estudio (lawFirmCode).
 */
export const getCasos = async (lawFirmCode: string): Promise<Caso[]> => {
  const { casos } = await callFn<{ casos: Caso[] }>(
    `getCasos?lawFirmCode=${lawFirmCode}`
  );
  return casos;
};

// al final de src/lib/api.ts (sin tocar nada de arriba)

export interface Profile {
  firstName: string;
  lastName: string;
  uniqueCode: string;
}

export interface LawFirm {
  name: string;
  code: string;
  managerCode: string;
  members: Profile[];
}

/**
 * Obtiene los datos del estudio al que pertenece el usuario,
 * incluyendo la lista de miembros (Profile[]).
 */
export const getMyLawFirm = async (userCode: string): Promise<LawFirm> => {
  const { firm } = await callFn<{ firm: LawFirm }>(
    `getMyLawFirm?userCode=${encodeURIComponent(userCode)}`
  );
  return firm;
};
