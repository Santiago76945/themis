// src/components/Menu.tsx

"use client";

import React from "react";
import { UserData } from "@/context/AuthContext";
import "@/styles/Menu.css";

interface MenuProps {
  userData: UserData | null;
  onLogout: () => void;
}

export default function Menu({ userData, onLogout }: MenuProps) {
  const fullName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.displayName || "Usuario";
  const userCode = userData?.uniqueCode || "SINCOD";

  const menuItems = [
    "Mi estudio juridico",
    "Finanzas del estudio",
    "Gestión de expedientes",
    "Gestión de clientes",
    "Agenda y audiencias",
    "Actualización de estados procesales",
    "Mapa de pruebas",
    "Creación de escritos",
    "Cartas documento y telegramas",
    "Reportes y estadísticas",
    "Gestión de usuarios y roles",
  ];

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1 className="menu-title">Dashboard</h1>
        <p className="menu-subtitle">
          ¡Hola, {fullName}!<br />
          Tu código de usuario es: <strong>{userCode}</strong>
        </p>
        <button className="logout-button styled-logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <nav className="menu-nav">
        {menuItems.map((item) => (
          <div key={item} className="menu-item">
            <div className="badge">Próximamente</div>
            <button className="menu-button">{item}</button>
          </div>
        ))}
      </nav>
    </div>
  );
}
