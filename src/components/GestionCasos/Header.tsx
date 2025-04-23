// src/components/GestionCasos/Header.tsx

"use client";

import React from "react";
import styles from "@/styles/GestionCasos.module.css";

interface HeaderProps {
  showForm: boolean;
  toggleForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showForm, toggleForm }) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Gestión de Casos</h2>
      <div className={styles.actionsHeader}>
        <button
          className="btn btn-secondary"
          onClick={toggleForm}
        >
          {showForm ? "Cancelar" : "Añadir caso"}
        </button>
      </div>
    </header>
  );
};