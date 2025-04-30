// src/app/menu/casos/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import {
  Cliente,
  Caso,
  CasoData,
  LogEntry,
  getClientes,
  getCasos,
  crearCaso,
  updateCaso,
  deleteCaso,
  getLogCasos,
} from "@/lib/api";

const GestionCasos = dynamic(
  () => import("@/components/GestionCasos/GestionCasos"),
  { ssr: false }
);

export default function CasosPage() {
  const { userData } = useAuth();

  const lawFirmCode = userData?.lawFirmCode || "";
  const userCode    = userData?.uniqueCode   || "";
  const userName    = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [casos, setCasos]       = useState<Caso[]>([]);
  const [casosLog, setLog]      = useState<LogEntry[]>([]);

  // Carga inicial de clientes, casos y log
  useEffect(() => {
    if (!lawFirmCode) return;

    getClientes(lawFirmCode).then(setClientes).catch(console.error);
    getCasos(lawFirmCode).then(setCasos).catch(console.error);
    getLogCasos(lawFirmCode).then(setLog).catch(console.error);
  }, [lawFirmCode]);

  // Funciones manejadoras
  const handleCrear = (clienteId: string, data: CasoData) =>
    crearCaso(lawFirmCode, clienteId, data, userCode, userName)
      .then(() =>
        Promise.all([
          getCasos(lawFirmCode).then(setCasos),
          getLogCasos(lawFirmCode).then(setLog),
        ])
      )
      .catch((err) => console.error("Error al crear caso:", err));

  const handleModificar = (casoId: string, data: CasoData) =>
    updateCaso(casoId, data, userCode, userName)
      .then(() =>
        Promise.all([
          getCasos(lawFirmCode).then(setCasos),
          getLogCasos(lawFirmCode).then(setLog),
        ])
      )
      .catch((err) => console.error("Error al modificar caso:", err));

  const handleEliminar = (casoId: string) =>
    deleteCaso(lawFirmCode, casoId, userCode, userName)
      .then(() =>
        Promise.all([
          getCasos(lawFirmCode).then(setCasos),
          getLogCasos(lawFirmCode).then(setLog),
        ])
      )
      .catch((err) => console.error("Error al eliminar caso:", err));

  return (
    <GestionCasos
      clientes={clientes}
      casos={casos}
      onCrear={handleCrear}
      onModificar={handleModificar}
      onEliminar={handleEliminar}
      log={casosLog}
    />
  );
}
