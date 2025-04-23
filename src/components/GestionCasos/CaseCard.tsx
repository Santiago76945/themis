// src/components/GestionCasos/CaseCard.tsx

"use client";

import React from "react";
import type { Cliente, CasoData } from "@/lib/api/types";
import type { Caso } from "@/lib/api/types";
import styles from "@/styles/GestionCasos.module.css";

interface CaseCardProps {
  caso: Caso;
  clientes: Cliente[];
  onModificar: (casoId: string, data: CasoData) => void;
  onEliminar: (casoId: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caso,
  clientes,
  onModificar,
  onEliminar,
}) => {
  const cliente = clientes.find((c) => c.id === caso.clienteId);

  return (
    <div className="card-secondary">
      <strong>
        {cliente
          ? `${cliente.firstName} ${cliente.lastName}`
          : "Cliente desconocido"}
      </strong>
      <p>Referencia: {caso.referencia || "—"}</p>
      <p>Expediente: {caso.numeroExpediente || "—"}</p>
      <p>Prioridad: {caso.prioridad || "—"}</p>
      <p>Etapa: {caso.etapaProcesal || "—"}</p>
      <p>Próx. Acción: {caso.proximaAccion || "—"}</p>
      <p>Inicio Juicio: {caso.fechaInicioJuicio || "—"}</p>
      <p>Responsable/s: {caso.responsables || "—"}</p>

      <div className={styles.caseActions}>
        <button
          className="btn btn-link"
          onClick={() => onModificar(caso._id, caso as CasoData)}
        >
          Editar
        </button>
        <button
          className="btn btn-link"
          onClick={() => onEliminar(caso._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
