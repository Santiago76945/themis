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
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  clients,
  onEdit,
  onDelete,
}) => {
  const cliente = clients.find((c) => c.id === task.clienteId);

  return (
    <div className={styles.taskCard}>
      <div className={styles.cardHeader}>
        <h3>{task.name}</h3>
        <small>{task.estado}</small>
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
