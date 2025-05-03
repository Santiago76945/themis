// src/app/menu/tasks/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import type { Task, Cliente, Abogado, TaskLogEntry } from "@/lib/api/types";
import { getClientes } from "@/lib/api/clients";                                      // :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
import {
  getTasks,
  crearTask,
  modificarTask,
  eliminarTask,
  getTaskLog,
} from "@/lib/api/tasks";                                                            // :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

const TaskManager = dynamic(() => import("@/components/TaskManager"), { ssr: false });

export default function TasksPage() {
  const { userData } = useAuth();
  const lawFirmCode = userData?.lawFirmCode || "";
  const userCode    = userData?.uniqueCode   || "";
  const userName    = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [logs, setLogs]         = useState<TaskLogEntry[]>([]);
  const [lawyers, setLawyers]   = useState<Abogado[]>([]); // Por implementar API de abogados

  // Carga inicial
  useEffect(() => {
    if (!lawFirmCode) return;

    getClientes(lawFirmCode)
      .then(setClientes)
      .catch(console.error);

    getTasks(lawFirmCode)
      .then(setTasks)
      .catch(console.error);

    getTaskLog(lawFirmCode)
      .then(setLogs)
      .catch(console.error);
  }, [lawFirmCode]);

  // Handlers que llaman a tu API y recargan listas
  const handleCreate = async (data: Omit<Task, "_id" | "createdAt" | "updatedAt">) => {
    await crearTask({ ...data, lawFirmCode }, userCode, userName);
    const [nuevasTasks, nuevoLog] = await Promise.all([
      getTasks(lawFirmCode),
      getTaskLog(lawFirmCode),
    ]);
    setTasks(nuevasTasks);
    setLogs(nuevoLog);
  };

  const handleUpdate = async (id: string, updates: Partial<Task>) => {
    await modificarTask(id, updates, userCode, userName, lawFirmCode);
    const [nuevasTasks, nuevoLog] = await Promise.all([
      getTasks(lawFirmCode),
      getTaskLog(lawFirmCode),
    ]);
    setTasks(nuevasTasks);
    setLogs(nuevoLog);
  };

  const handleDelete = async (id: string) => {
    await eliminarTask(id, lawFirmCode, userCode, userName);
    const [nuevasTasks, nuevoLog] = await Promise.all([
      getTasks(lawFirmCode),
      getTaskLog(lawFirmCode),
    ]);
    setTasks(nuevasTasks);
    setLogs(nuevoLog);
  };

  // Si no tenemos lawFirmCode (todavía cargando), no renderizamos nada
  if (!lawFirmCode) return null;

  return (
    <TaskManager
      tasks={tasks}
      clients={clientes}
      lawyers={lawyers}
      logs={logs}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
