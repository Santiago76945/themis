// src/components/GestionCasos/CaseList.tsx

"use client";

import React from "react";
import type { Cliente, Caso } from "@/lib/api/types";
import { CaseCard } from "./CaseCard";
import styles from "@/styles/GestionCasos.module.css";

interface CaseListProps {
  casos: Caso[];
  clientes: Cliente[];
  onEdit: (c: Caso) => void;
  onEliminar: (casoId: string) => void;
  onViewDetails: (c: Caso) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  casos,
  clientes,
  onEdit,
  onEliminar,
  onViewDetails,
}) => {
  if (casos.length === 0) {
    return <p className="mt-2">No se encontraron casos.</p>;
  }

  return (
    <div className={styles.caseList}>
      {casos.map((c) => (
        <div
          key={c._id}
          className="cursor-pointer"
          onClick={() => onViewDetails(c)}
        >
          <CaseCard
            caso={c}
            clientes={clientes}
            onEdit={onEdit}
            onEliminar={onEliminar}
          />
        </div>
      ))}
    </div>
  );
};
