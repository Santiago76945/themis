// src/components/ClientManager/ClientLogs.tsx

import React from "react";
import type { LogEntry } from "@/lib/api/types";

interface ClientLogsProps {
  logs: LogEntry[];
}

export default function ClientLogs({ logs }: ClientLogsProps) {
  return (
    <div className="card-secondary mt-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <h4>Registro de actividad</h4>
      {logs.map((log, index) => (
        <div key={index} className="mb-1">
          <small>
            {new Date(log.fecha).toLocaleString("es-AR", { timeZone: "America/Argentina/Cordoba" })}
          </small>
          {' – '} {log.usuario} {log.accion}
        </div>
      ))}
    </div>
  );
}
