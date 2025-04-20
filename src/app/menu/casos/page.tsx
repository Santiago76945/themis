// src/app/menu/casos/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { Cliente, CasoData, LogEntry, getClientes, crearCaso, modificarCaso, eliminarCaso, getLogCasos } from "@/lib/api";

// Cargamos dinámicamente el componente de gestión de casos en cliente
const GestionCasos = dynamic(() => import("@/components/GestionCasos"), { ssr: false });

export default function CasosPage() {
  const { userData } = useAuth();
  const lawFirmCode = userData?.uniqueCode || "";
  const userCode    = userData?.uniqueCode || "";
  const userName    = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [casosLog, setLog] = useState<LogEntry[]>([]);

  // Carga inicial de clientes y log
  useEffect(() => {
    if (!lawFirmCode) return;
    getClientes(lawFirmCode)
      .then(setClientes)
      .catch((err) => console.error("Error al obtener clientes:", err));
    getLogCasos()
      .then(setLog)
      .catch((err) => console.error("Error al obtener log de casos:", err));
  }, [lawFirmCode]);

  // Manejadores que pasan userCode y userName a las llamadas
  const handleCrear = (clienteId: string, data: CasoData) =>
    crearCaso(clienteId, data, userCode, userName)
      .then(() => getLogCasos().then(setLog))
      .catch((err) => console.error("Error al crear caso:", err));

  const handleModificar = (casoId: string, data: CasoData) =>
    modificarCaso(casoId, data, userCode, userName)
      .then(() => getLogCasos().then(setLog))
      .catch((err) => console.error("Error al modificar caso:", err));

  const handleEliminar = (casoId: string) =>
    eliminarCaso(casoId, userCode, userName)
      .then(() => getLogCasos().then(setLog))
      .catch((err) => console.error("Error al eliminar caso:", err));

  return (
    <GestionCasos
      clientes={clientes}
      casos={undefined /* tu fetch de casos aquí si tienes endpoint */}
      onCrear={handleCrear}
      onModificar={handleModificar}
      onEliminar={handleEliminar}
      log={casosLog}
    />
  );
}
