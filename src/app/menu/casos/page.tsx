// src/app/menu/casos/page.tsx

"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import {
  Cliente,
  CasoData,
  LogEntry,
  getClientes,
  crearCaso,
  modificarCaso,
  eliminarCaso,
  getLogCasos,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const GestionCasos = dynamic(() => import("@/components/GestionCasos"), {
  ssr: false,
});

export default function CasosPage() {
  const auth = useAuth();
  const lawFirmCode = auth?.uniqueCode ?? "";

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!lawFirmCode) return;

    getClientes(lawFirmCode)
      .then(setClientes)
      .catch((err) => console.error("Error al cargar clientes:", err));

    getLogCasos()
      .then(setLog)
      .catch((err) => console.error("Error al cargar log de casos:", err));
  }, [lawFirmCode]);

  const handleCrear = (clienteId: string, data: CasoData) =>
    crearCaso(clienteId, data)
      .then(() => getLogCasos().then(setLog))
      .catch((err) => console.error("Error al crear caso:", err));

  const handleModificar = (casoId: string, data: CasoData) =>
    modificarCaso(casoId, data)
      .then(() => getLogCasos().then(setLog))
      .catch((err) => console.error("Error al modificar caso:", err));

  const handleEliminar = (casoId: string) =>
    eliminarCaso(casoId)
      .then(() => getLogCasos().then(setLog))
      .catch((err) => console.error("Error al eliminar caso:", err));

  return (
    <GestionCasos
      clientes={clientes}
      onCrear={handleCrear}
      onModificar={handleModificar}
      onEliminar={handleEliminar}
      log={log}
    />
  );
}
