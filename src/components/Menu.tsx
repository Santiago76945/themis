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
      .then((res) => res.json())
      .then((data) => setInvitations(data.invites || []));
  }, [userCode]);

  const handleRespond = (id: string, resp: "accepted" | "rejected") => {
    fetch("/.netlify/functions/respondInvitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId: id, response: resp }),
    }).then(() => setInvitations((inv) => inv.filter((i) => i._id !== id)));
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
    <div className="container">
      <div className="card menu-card">
        <header className="menu-header">
          <h1 className="menu-title">Dashboard</h1>
          <p className="menu-subtitle">
            ¡Hola, {fullName}!<br />
            Tu código de usuario es: <strong>{userCode || "SINCOD"}</strong>
          </p>
          <button className="btn styled-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </header>

        {invitations.length > 0 && (
          <div className="card invitations-card">
            <h3 className="invitation-header">Invitaciones pendientes</h3>
            {invitations.map((inv) => (
              <div key={inv._id} className="invitation-item">
                <span>Estudio {inv.lawFirmCode}</span>
                <div className="invitation-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRespond(inv._id, "accepted")}
                  >
                    Aceptar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleRespond(inv._id, "rejected")}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <nav className="menu-nav">
          {menuItems.map((item, idx) => (
            <div key={item} className="menu-item">
              {idx > 0 && <div className="badge">Próximamente</div>}
              <button
                className="btn menu-button"
                disabled={idx !== 0}
                onClick={() => idx === 0 && router.push("/menu/mi-estudio")}
              >
                {item}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
);
}
