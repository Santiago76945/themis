// src/components/Menu.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/Menu.module.css";

interface Invitation {
  _id: string;
  lawFirmCode: string;
}

interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  enabled: boolean;
}

interface UserData {
  uniqueCode?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

interface MenuProps {
  userData: UserData | null;
  onLogout: () => void;
}

export default function Menu({ userData, onLogout }: MenuProps) {
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

  const menuItems: MenuItem[] = [
    { label: "Mi estudio jurídico", icon: "/icons/office-icon.png", path: "/menu/mi-estudio", enabled: true },
    { label: "Gestión de clientes", icon: "/icons/clients-icon.png", path: "/menu/clientes", enabled: true },
    { label: "Gestión de casos", icon: "/icons/court-file-icon.png", path: "/menu/casos", enabled: true },
    { label: "Gestion de tareas", icon: "/icons/tasks-icon.png", enabled: false },
    { label: "Finanzas del estudio", icon: "/icons/finances-icon.png", enabled: false },
    { label: "Agenda y audiencias", icon: "/icons/calendar-icon.png", enabled: false },
    { label: "Actualización de estados procesales", icon: "/icons/notifications-icon.png", enabled: false },
    { label: "Creación de escritos", icon: "/icons/logo-redaccion.png", enabled: false },
    { label: "Cartas documento y telegramas", icon: "/icons/logo-tareas.png", enabled: false },
    { label: "Reportes y estadísticas", icon: "/icons/report-icon.png", enabled: false },
    { label: "Gestión de usuarios y roles", icon: "/icons/users-icon.png", enabled: false },
  ];

  return (
    <div className="container">
      <div className={`card ${styles.menuCard}`}>
        <header className={styles.menuHeader}>
          <h1 className={styles.menuTitle}>Dashboard</h1>
          <p className={styles.menuSubtitle}>
          ¡Hola, Dr. {fullName}! Bienvenido a Themis.<br />
            Tu código de usuario es: <strong>{userCode || "SINCOD"}</strong>
          </p>
          <button className="btn btn-link" onClick={onLogout}>
            Cerrar sesión
          </button>
        </header>

        {invitations.length > 0 && (
          <div className={`card-secondary ${styles.invitationsCard}`}>            
            <h3 className={styles.invitationHeader}>Invitaciones pendientes</h3>
            {invitations.map((inv) => (
              <div key={inv._id} className={styles.invitationItem}>
                <span>Estudio {inv.lawFirmCode}</span>
                <div className={styles.invitationActions}>
                  <button className="btn btn-primary" onClick={() => handleRespond(inv._id, "accepted")}>Aceptar</button>
                  <button className="btn btn-secondary" onClick={() => handleRespond(inv._id, "rejected")}>Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <nav className={styles.menuNav}>
          {menuItems.map((item, idx) => (
            <div key={idx} className={styles.menuItem}>
              <button
                className={`btn ${styles.menuButton}`}
                disabled={!item.enabled}
                onClick={() => item.enabled && item.path && router.push(item.path)}
              >
                <Image src={item.icon} alt={`${item.label} icon`} width={48} height={48} className={styles.icon} />
                <span className={styles.menuLabel}>{item.label}</span>
                {!item.enabled && <div className={styles.badge}>Próximamente</div>}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}