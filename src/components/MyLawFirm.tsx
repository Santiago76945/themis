// src/components/MyLawFirm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { generateUniqueCode } from "@/utils/generateCode";

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

  // Cargo estudio e invitaciones
  useEffect(() => {
    if (!userCode) return;

    fetch(`/.netlify/functions/getMyLawFirm?userCode=${userCode}`)
      .then((res) => res.json())
      .then((data) => setFirm(data.firm || null));

    fetch(`/.netlify/functions/getInvitations?userCode=${userCode}`)
      .then((res) => res.json())
      .then((data) => setPendingInvites(data.invites || []));
  }, [userCode]);

  // Cargo perfiles de cada miembro
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
    if (!newFirmName.trim()) return alert("Ingresá un nombre para el estudio.");
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
    <div className="p-4">
      {!firm ? (
        <>
          <h2 className="text-xl font-bold mb-2">Crear Estudio Jurídico</h2>
          <input
            type="text"
            value={newFirmName}
            onChange={(e) => setNewFirmName(e.target.value)}
            placeholder="Nombre del estudio"
            className="p-2 border rounded mb-2"
          />
          <button
            onClick={createFirm}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear
          </button>

          {pendingInvites.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Tus invitaciones:</h3>
              {pendingInvites.map((inv) => (
                <div key={inv._id} className="flex items-center gap-2">
                  <span>{inv.lawFirmCode}</span>
                  <button onClick={() => respondInvite(inv._id, "accepted")}>
                    Aceptar
                  </button>
                  <button onClick={() => respondInvite(inv._id, "rejected")}>
                    Rechazar
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">Mi Estudio Jurídico</h2>
          <p>
            <strong>Nombre:</strong> {firm.name}
          </p>
          <p>
            <strong>Código:</strong> {firm.code}
          </p>

          {isManager && (
            <div className="mt-4">
              <h3 className="font-semibold">Invitar abogado:</h3>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Código de usuario"
                className="p-1 border rounded mr-2"
              />
              <button onClick={sendInvite}>Enviar invitación</button>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold">Miembros:</h3>
            <ul>
              {firm.members.map((m) => (
                <li key={m} className="flex justify-between">
                  <span>
                    {memberProfiles[m]
                      ? `${memberProfiles[m].firstName} ${memberProfiles[m].lastName} (ID: ${m})`
                      : m}
                  </span>
                  {isManager && m !== firm.managerCode && (
                    <button onClick={() => removeMember(m)}>Eliminar</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {isManager && (
            <button className="mt-4 text-red-600" onClick={deleteFirm}>
              Eliminar Estudio
            </button>
          )}
        </>
      )}

      {/* Botón para volver al menú */}
      <button
        onClick={() => router.push("/menu")}
        className="mt-6 text-blue-600 underline"
      >
        Volver al menú
      </button>
    </div>
  );
}
