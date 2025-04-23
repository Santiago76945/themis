// src/components/GestionCasos/CaseList.tsx

"use client";

import React from "react";
import type { Cliente, CasoData } from "@/lib/api/types";
import type { Caso } from "@/lib/api/types";
import { CaseCard } from "./CaseCard";
import styles from "@/styles/GestionCasos.module.css";

interface CaseListProps {
  casos: Caso[];
  clientes: Cliente[];
  onModificar: (casoId: string, data: CasoData) => void;
  onEliminar: (casoId: string) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  casos,
  clientes,
  onModificar,
  onEliminar,
}) => {
  if (casos.length === 0) {
    return <p className="mt-2">No se encontraron casos.</p>;
  }

  return (
    <div className={styles.caseList}>
      {casos.map((c) => (
        <CaseCard
          key={c._id}
          caso={c}
          clientes={clientes}
          onModificar={onModificar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
};
