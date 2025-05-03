// src/components/TaskManager/TaskCard.tsx

"use client";

import React from "react";
import type { Task, Cliente } from "@/lib/api/types";
import styles from "@/styles/TaskManager.module.css";

export interface TaskCardProps {
  task: Task;
  clients: Cliente[];
  onViewDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  clients,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const cliente = clients.find((c) => c.id === task.clienteId);
  const prioridadProc = task.prioridadProcesal?.toLowerCase() ?? "";
  const prioridadCom = task.prioridadComercial?.toLowerCase() ?? "";

  return (
    <div className={styles.taskCard}>
      <div className={styles.cardHeader}>
        <h3>{task.name}</h3>
        <div className={styles.badges}>
          <small>{task.estado}</small>
          <small>
            Proc: {task.prioridadProcesal}
            <span className={`${styles.dot} ${styles[prioridadProc]}`} />
          </small>
          <small>
            Com: {task.prioridadComercial}
            <span className={`${styles.dot} ${styles[prioridadCom]}`} />
          </small>
        </div>
      </div>

      <div className={styles.cardContent}>
        {task.description && <p>{task.description}</p>}
        {cliente ? (
          <p>
            <strong>Cliente:</strong> {cliente.name}
          </p>
        ) : (
          <p>
            <strong>Cliente:</strong> —
          </p>
        )}
      </div>

      <div className={styles.cardActions}>
        <button className="btn btn-link" onClick={() => onViewDetails(task)}>
          Ver detalles
        </button>
        <button className="btn btn-link" onClick={() => onEdit(task)}>
          Editar
        </button>
        <button className="btn btn-link" onClick={() => onDelete(task._id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
};
