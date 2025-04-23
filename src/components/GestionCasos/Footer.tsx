// src/components/GestionCasos/Footer.tsx

"use client";

import React from "react";
import styles from "@/styles/GestionCasos.module.css";

interface FooterProps {
  onToggleLogs: () => void;
  onBack: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleLogs, onBack }) => {
  return (
    <footer className={`${styles.bottomActions} actions`}>
      <button className="btn btn-link" onClick={onToggleLogs}>
        Ver registro de actividad
      </button>
      <button className="btn btn-link" onClick={onBack}>
        Volver al menú
      </button>
    </footer>
  );
};
