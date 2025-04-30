// src/lib/api/types.ts

/**
 * Cliente para el estudio jurídico
 */
export interface Cliente {
  id: string;
  name: string;                // Nombre o razón social (obligatorio)
  dni?: string;
  phone?: string;
  email?: string;
  address?: string;
  dateOfAlta?: string;
  clientObservations?: string;
  lawFirmCode: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos para crear o actualizar un caso
 */
export interface CasoData {
  clienteId: string;                       // ID del cliente (obligatorio)
  rol: string;                             // Rol en el caso (obligatorio)
  caseType: 'propio' | 'delegado';         // Caso propio o delegado (obligatorio)
  honorariosEstimados?: number;            // Honorarios estimados
  referencia: string;                      // Referencia / Descripción (obligatorio)
  numeroExpediente?: string;               // Nº de expediente
  caratula?: string;                       // Carátula
  tribunal?: string;                       // Juzgado / Tribunal
  estado?: string;                         // Estado
  proximaTarea?: string;                   // Próxima tarea
  fechaProximaTarea?: string;              // Fecha próxima tarea (YYYY-MM-DD)
  prioridad: 'Alta' | 'Media' | 'Baja';     // Prioridad (obligatorio)
  observaciones?: string;                  // Observaciones adicionales
}

/**
 * Caso recuperado del servidor
 */
export interface Caso {
  _id: string;
  clienteId: string;
  rol: string;
  caseType: 'propio' | 'delegado';
  honorariosEstimados?: number;
  referencia: string;
  numeroExpediente?: string;
  caratula?: string;
  tribunal?: string;
  estado?: string;
  proximaTarea?: string;
  fechaProximaTarea?: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Entrada de log genérico (usado para casos y clientes)
 */
export interface LogEntry {
  usuario: string;
  accion: string;
  fecha: string;
}

/**
 * Abogado (miembro del estudio)
 */
export interface Abogado {
  id: string;
  nombre: string;
}

/**
 * Dependencia entre tareas
 */
export interface Dependency {
  taskId: string;
  type: 'espera' | 'retraso';
}

/**
 * Documento adjunto a una tarea
 */
export interface Attachment {
  url: string;
  description: string;
}

/**
 * Comentario en una tarea
 */
export interface CommentEntry {
  userCode: string;
  userName: string;
  text: string;
  timestamp: string;
}

/**
 * Tarea del TaskManager
 */
export interface Task {
  _id: string;
  lawFirmCode: string;
  name: string;
  description?: string;
  clienteId?: string;
  numeroExpediente?: string;
  prioridadProcesal: 'Alta' | 'Media' | 'Baja';
  prioridadComercial: 'Alta' | 'Media' | 'Baja';
  principalResponsables: string[];
  coResponsables: string[];
  dependencies: Dependency[];
  deadline?: string;
  attachments: Attachment[];
  estimatedTime?: string;
  comments: CommentEntry[];
  estado: 'pendiente' | 'comenzada' | 'finalizada';
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Entrada de log de tareas
 */
export interface TaskLogEntry {
  taskId: string;
  lawFirmCode: string;
  userCode: string;
  userName: string;
  action: string;
  timestamp: string;
}

/**
 * Perfil de usuario para LawFirm
 */
export interface Profile {
  firstName: string;
  lastName: string;
  uniqueCode: string;
}

/**
 * Estudio jurídico con sus miembros
 */
export interface LawFirm {
  name: string;
  code: string;
  managerCode: string;
  members: Profile[];
}

/**
 * Invitación a un estudio jurídico
 */
export interface Invitation {
  _id: string;
  lawFirmCode: string;
  invitedUserCode: string;       // el código único de 6 dígitos
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;             // timestamp en ISO
}
