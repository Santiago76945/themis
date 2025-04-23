// src/components/GestionCasos/Filters.tsx

"use client";

import React, { ChangeEvent } from "react";
import styles from "@/styles/GestionCasos.module.css";

interface FiltersProps {
  searchTerm: string;
  priorityFilter: "" | "Alta" | "Media" | "Baja";
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: "" | "Alta" | "Media" | "Baja") => void;
}

export const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  priorityFilter,
  onSearchChange,
  onPriorityChange,
}) => {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Buscar por apellido"
        className="input"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
      />
      <select
        className="input"
        value={priorityFilter}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onPriorityChange(
            e.target.value as "" | "Alta" | "Media" | "Baja"
          )
        }
      >
        <option value="">Todas las prioridades</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
    </div>
  );
};
