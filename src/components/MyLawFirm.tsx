// src/components/MyLawFirm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/MyLawFirm.module.css";

interface LawFirm {
  name: string;
  code: string;
  managerCode: string;
  members: string[];
}

interface Invitation {
  _id: string;
  lawFirmCode: string;
  invitedUserCode: string;
}

interface Profile {
  firstName: string;
  lastName: string;
}

export default function MyLawFirm() {
  const router = useRouter();
  const { userData } = useAuth();
  const userCode = userData?.uniqueCode || "";

  const [firm, setFirm] = useState<LawFirm | null>(null);
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, Profile>>({});
  const [newFirmName, setNewFirmName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const isManager = firm?.managerCode === userCode;

  // Carga los datos del estudio y las invitaciones al montar
  useEffect(() => {
    if (!userCode) return;
    fetch(`/.netlify/functions/getMyLawFirm?userCode=${userCode}`)
      .then((res) => res.json())
      .then((data) => setFirm(data.firm || null));

    fetch(`/.netlify/functions/getInvitations?userCode=${userCode}`)
      .then((res) => res.json())
      .then((data) => setPendingInvites(data.invites || []));
  }, [userCode]);

  // Carga perfiles de los miembros
  useEffect(() => {
    if (!firm) return;
    firm.members.forEach((code) => {
      if (!memberProfiles[code]) {
        fetch(`/.netlify/functions/getUserEmailByUniqueCode?uniqueCode=${code}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.firstName && data.lastName) {
              setMemberProfiles((prev) => ({
                ...prev,
                [code]: { firstName: data.firstName, lastName: data.lastName },
              }));
            }
          });
      }
    });
  }, [firm, memberProfiles]);

  const createFirm = () => {
    if (!newFirmName.trim()) {
      alert("Ingresá un nombre para el estudio.");
      return;
    }
    fetch("/.netlify/functions/createLawFirm", {
      method: "POST",
      body: JSON.stringify({ name: newFirmName, managerCode: userCode }),
    })
      .then((res) => res.json())
      .then((data) => setFirm(data.lawfirm));
  };

  const sendInvite = () => {
    if (!inviteCode.trim() || !firm) return;
    fetch("/.netlify/functions/inviteToLawFirm", {
      method: "POST",
      body: JSON.stringify({
        lawFirmCode: firm.code,
        invitedUserCode: inviteCode,
        managerCode: userCode,
      }),
    }).then(() => {
      alert("Invitación enviada");
      setInviteCode("");
    });
  };

  const respondInvite = (id: string, resp: "accepted" | "rejected") => {
    fetch("/.netlify/functions/respondInvitation", {
      method: "POST",
      body: JSON.stringify({ invitationId: id, response: resp }),
    }).then(() =>
      setPendingInvites((inv) => inv.filter((i) => i._id !== id))
    );
  };

  const removeMember = (memberCode: string) => {
    setFirm((f) =>
      f ? { ...f, members: f.members.filter((m) => m !== memberCode) } : f
    );
  };

  const deleteFirm = () => {
    setFirm(null);
  };

  return (
    <div className="container">
      <div className={`card ${styles.mylawfirmCard}`}>
        {!firm ? (
          <section>
            <h2 className={styles.sectionTitle}>Crear Estudio Jurídico</h2>
            <div className={styles.formRow}>
              <input
                type="text"
                value={newFirmName}
                onChange={(e) => setNewFirmName(e.target.value)}
                placeholder="Nombre del estudio"
                className="input"
              />
              <button onClick={createFirm} className="btn btn-primary">
                Crear
              </button>
            </div>

            {pendingInvites.length > 0 && (
              <div className="card-secondary">
                <h3 className={styles.sectionSubtitle}>Tus invitaciones</h3>
                {pendingInvites.map((inv) => (
                  <div key={inv._id} className={styles.invitationItem}>
                    <span>{inv.lawFirmCode}</span>
                    <div className={styles.invitationActions}>
                      <button
                        className="btn btn-primary"
                        onClick={() => respondInvite(inv._id, "accepted")}
                      >
                        Aceptar
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => respondInvite(inv._id, "rejected")}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section>
              <h2 className={styles.sectionTitle}>Mi Estudio Jurídico</h2>
              <p>
                <strong>Nombre:</strong> {firm.name}
              </p>
              <p>
                <strong>Código:</strong> {firm.code}
              </p>
            </section>

            {isManager && (
              <div className="card-secondary">
                <h3 className={styles.sectionSubtitle}>Invitar abogado</h3>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Código de usuario"
                    className="input"
                  />
                  <button onClick={sendInvite} className="btn btn-primary">
                    Enviar invitación
                  </button>
                </div>
              </div>
            )}

            {pendingInvites.length > 0 && (
              <div className="card-secondary">
                <h3 className={styles.sectionSubtitle}>
                  Invitaciones pendientes
                </h3>
                {pendingInvites.map((inv) => (
                  <div key={inv._id} className={styles.invitationItem}>
                    <span>{inv.lawFirmCode}</span>
                    <div className={styles.invitationActions}>
                      <button
                        className="btn btn-primary"
                        onClick={() => respondInvite(inv._id, "accepted")}
                      >
                        Aceptar
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => respondInvite(inv._id, "rejected")}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="card-secondary">
              <h3 className={styles.sectionSubtitle}>Miembros</h3>
              <ul className={styles.membersList}>
                {firm.members.map((m) => (
                  <li key={m} className={styles.memberItem}>
                    <span>
                      {memberProfiles[m]
                        ? `${memberProfiles[m].firstName} ${memberProfiles[m].lastName} (ID: ${m})`
                        : m}
                    </span>
                    {isManager && m !== firm.managerCode && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => removeMember(m)}
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {isManager && (
              <button
                className="btn btn-secondary"
                onClick={deleteFirm}
              >
                Eliminar Estudio
              </button>
            )}
          </>
        )}

        <button
          className="btn btn-link mt-4"
          onClick={() => router.push("/menu")}
        >
          Volver al menú
        </button>
      </div>
    </div>
  );
}
