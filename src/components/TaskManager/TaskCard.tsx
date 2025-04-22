// src/components/TaskManager/TaskCard.tsx

"use client";

import React from "react";
import type { Task, Cliente } from "@/lib/api/types";
import styles from "@/styles/TaskManager.module.css";

export interface TaskCardProps {
  task: Task;
  clients: Cliente[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  clients,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const cliente = clients.find((c) => c.id === task.clienteId);
  const procClass = task.prioridadProcesal.toLowerCase();
  const comClass  = task.prioridadComercial.toLowerCase();

  return (
    <div className={styles.taskCard}>
      <div className={styles.cardHeader}>
        <h3>{task.name}</h3>
        <div className={styles.badges}>
          <small>{task.estado}</small>
          <small>
            Proc: {task.prioridadProcesal}
            <span className={`${styles.dot} ${styles[procClass]}`} />
          </small>
          <small>
            Com: {task.prioridadComercial}
            <span className={`${styles.dot} ${styles[comClass]}`} />
          </small>
        </div>
      </div>

      <div className={styles.cardContent}>
        {task.description && <p>{task.description}</p>}
        {cliente && (
          <p>
            Cliente: {cliente.firstName} {cliente.lastName}
          </p>
        )}
      </div>

      <div className={styles.cardActions}>
        <button
          className="btn btn-link"
          onClick={() => onViewDetails(task)}
        >
          Ver detalles
        </button>
        <button
          className="btn btn-link"
          onClick={() => onEdit(task)}
        >
          Editar
        </button>
        <button
          className="btn btn-link"
          onClick={() => onDelete(task._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
