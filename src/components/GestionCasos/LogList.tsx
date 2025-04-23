// src/components/GestionCasos/LogList.tsx

"use client";

import React from "react";
import type { LogEntry } from "@/lib/api/types";
import styles from "@/styles/GestionCasos.module.css";

interface LogListProps {
  log: LogEntry[];
}

export const LogList: React.FC<LogListProps> = ({ log }) => {
  if (log.length === 0) {
    return <p>No hay registros aún.</p>;
  }

  return (
    <div className="card-secondary">
      <h3>Registro de Casos</h3>
      <ul className={styles.logList}>
        {log.map((entry, i) => (
          <li key={i}>
            <small>{entry.fecha}</small> – <strong>{entry.usuario}</strong> {entry.accion}
          </li>
        ))}
      </ul>
    </div>
  );
};
