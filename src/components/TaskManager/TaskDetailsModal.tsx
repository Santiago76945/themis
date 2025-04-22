// src/components/TaskManager/TaskDetailsModal.tsx

"use client";

import React from "react";
import type { Task, Cliente, Abogado } from "@/lib/api/types";
import styles from "@/styles/TaskManager.module.css";

interface TaskDetailsModalProps {
  task: Task;
  clients: Cliente[];
  lawyers: Abogado[];
  onClose: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  clients,
  lawyers,
  onClose,
}) => {
  const cliente = clients.find((c) => c.id === task.clienteId);
  const principal = lawyers.find((l) => l.id === task.principalResponsables[0]);
  const coResponsables = lawyers.filter((l) =>
    task.coResponsables.includes(l.id)
  );
  const procClass = task.prioridadProcesal.toLowerCase();
  const comClass = task.prioridadComercial.toLowerCase();

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className="text-xl font-bold mb-4">Detalles de la tarea</h2>

        <p><strong>Nombre:</strong> {task.name}</p>
        {task.description && <p><strong>Descripción:</strong> {task.description}</p>}
        {cliente && (
          <p>
            <strong>Cliente:</strong> {cliente.firstName} {cliente.lastName}
          </p>
        )}
        {task.numeroExpediente && (
          <p><strong>Nº expediente:</strong> {task.numeroExpediente}</p>
        )}

        <p>
          <strong>Prioridad procesal:</strong> Proc: {task.prioridadProcesal}
          <span className={`${styles.dot} ${styles[procClass]}`} />
        </p>
        <p>
          <strong>Prioridad comercial:</strong> Com: {task.prioridadComercial}
          <span className={`${styles.dot} ${styles[comClass]}`} />
        </p>

        <p><strong>Estado:</strong> {task.estado}</p>

        {principal && (
          <p><strong>Responsable principal:</strong> {principal.nombre}</p>
        )}
        {coResponsables.length > 0 && (
          <p>
            <strong>Co-responsables:</strong>{" "}
            {coResponsables.map((l) => l.nombre).join(", ")}
          </p>
        )}

        {task.dependencies.length > 0 && (
          <div>
            <strong>Dependencias:</strong>
            <ul className="list-disc list-inside ml-4">
              {task.dependencies.map((d) => (
                <li key={d.taskId}>
                  {d.taskId} ({d.type})
                </li>
              ))}
            </ul>
          </div>
        )}

        {task.deadline && (
          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString("es-AR")}</p>
        )}

        {task.estimatedTime && (
          <p><strong>Tiempo estimado:</strong> {task.estimatedTime}</p>
        )}

        {task.attachments.length > 0 && (
          <div>
            <strong>Archivos adjuntos:</strong>
            <ul className="list-disc list-inside ml-4">
              {task.attachments.map((a) => (
                <li key={a.url}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    {a.description || a.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {task.comments.length > 0 && (
          <div>
            <strong>Comentarios:</strong>
            <ul className="list-disc list-inside ml-4">
              {task.comments.map((c, idx) => (
                <li key={idx}>
                  <small>
                    {new Date(c.timestamp).toLocaleString("es-AR", {
                      timeZone: "America/Argentina/Cordoba",
                    })}
                  </small>{" – "}
                  <strong>{c.userName}</strong>: {c.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.modalFooter}>
          <button className="btn btn-link" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
