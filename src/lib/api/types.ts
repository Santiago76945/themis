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
 * Datos de un caso
 */
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

  /**
   * Entrada de log genérico
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
    type: "espera" | "retraso";
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
    prioridadProcesal: "Alta" | "Media" | "Baja";
    prioridadComercial: "Alta" | "Media" | "Baja";
    principalResponsables: string[];
    coResponsables: string[];
    dependencies: Dependency[];
    deadline?: string;
    attachments: Attachment[];
    estimatedTime?: string;
    comments: CommentEntry[];
    estado: "pendiente" | "comenzada" | "finalizada";
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
   * Caso recuperado para lista de casos
   */
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

