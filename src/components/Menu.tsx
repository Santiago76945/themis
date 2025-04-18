// src/components/Menu.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "@/styles/Menu.css";

interface Invitation {
  _id: string;
  lawFirmCode: string;
}

export default function Menu({ onLogout }: { onLogout: () => void }) {
  const { userData } = useAuth();
  const userCode = userData?.uniqueCode || "";
  const router = useRouter();

  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    if (!userCode) return;
    fetch(`/.netlify/functions/getInvitations?userCode=${userCode}`)
      .then(res => res.json())
      .then(data => setInvitations(data.invites || []));
  }, [userCode]);

  const handleRespond = (id: string, resp: "accepted" | "rejected") => {
    fetch("/.netlify/functions/respondInvitation", {
      method: "POST",
      body: JSON.stringify({ invitationId: id, response: resp }),
    }).then(() => {
      setInvitations(inv => inv.filter(i => i._id !== id));
    });
  };

  const fullName = userData
    ? userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData.displayName
    : "Usuario";

  const menuItems = [
    "Mi estudio jurídico",
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
          Tu código de usuario es: <strong>{userCode || "SINCOD"}</strong>
        </p>
        <button className="logout-button styled-logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      {invitations.length > 0 && (
        <div className="invitations-alert">
          <h3>Tienes invitaciones pendientes:</h3>
          {invitations.map(inv => (
            <div key={inv._id} className="invitation-item">
              <span>Estudio {inv.lawFirmCode}</span>
              <button onClick={() => handleRespond(inv._id, "accepted")}>
                Aceptar
              </button>
              <button onClick={() => handleRespond(inv._id, "rejected")}>
                Rechazar
              </button>
            </div>
          ))}
        </div>
      )}

      <nav className="menu-nav">
        {menuItems.map((item, idx) => {
          if (idx === 0) {
            // Mi estudio jurídico
            return (
              <div key={item} className="menu-item">
                <button
                  className="menu-button"
                  onClick={() => router.push("/menu/mi-estudio")}
                >
                  {item}
                </button>
                {invitations.length > 0 && (
                  <div className="badge">{invitations.length}</div>
                )}
              </div>
            );
          }
          return (
            <div key={item} className="menu-item">
              <div className="badge">Próximamente</div>
              <button className="menu-button">{item}</button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
