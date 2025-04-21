// src/components/TaskManager/TaskLog.tsx

"use client";

import React from "react";
import { TaskLogEntry } from "./types";
import styles from "@/styles/TaskManager.module.css";

export interface TaskLogProps {
  logs: TaskLogEntry[];
}

export const TaskLog: React.FC<TaskLogProps> = ({ logs }) => {
  if (logs.length === 0) return null;

  return (
    <div className={styles.logSection}>
      <h3>Registro de tareas</h3>
      {logs.map((entry, idx) => (
        <div key={idx} className={styles.logEntry}>
          <small>
            {new Date(entry.timestamp).toLocaleString("es-AR", {
              timeZone: "America/Argentina/Cordoba",
            })}
          </small>{" "}
          – <strong>{entry.userName}</strong> {entry.action}
        </div>
      ))}
    </div>
  );
};
