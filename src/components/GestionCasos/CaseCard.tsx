// src/components/GestionCasos/CaseCard.tsx

"use client";

import React from "react";
import type { Cliente, Caso, CasoData } from "@/lib/api/types";
import styles from "@/styles/GestionCasos.module.css";

interface CaseCardProps {
  caso: Caso;
  clientes: Cliente[];
  onEdit: (c: Caso) => void;
  onEliminar: (casoId: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  caso,
  clientes,
  onEdit,
  onEliminar,
}) => {
  const cliente = clientes.find(c => c.id === caso.clienteId);

  return (
    <div className="card-secondary">
      <strong className="mb-1">
        {cliente
          ? `${cliente.firstName} ${cliente.lastName}`
          : "Cliente desconocido"}
      </strong>
      <p>Referencia: {caso.referencia || "—"}</p>
      {/* aquí podrías añadir Próx. Acción y Fecha si quieres */}
      <div className={styles.caseActions}>
        <button
          className="btn btn-link"
          onClick={() => onEdit(caso)}
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
