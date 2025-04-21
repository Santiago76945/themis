// src/components/TaskManager.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getTasks,
  crearTask,
  modificarTask,
  eliminarTask,
  getTaskLog,
  getClientes,
  getMyLawFirm,
} from "@/lib/api";

// 👉 Usamos el archivo de tipos único de la capa API
import type {
  Task,
  Cliente,
  Abogado,
  TaskLogEntry,
} from "@/lib/api/types";

import { TaskForm } from "./TaskManager/TaskForm";
import { TaskCard } from "./TaskManager/TaskCard";
import { TaskLog } from "./TaskManager/TaskLog";
import styles from "@/styles/TaskManager.module.css";

export function TaskManager() {
  const router = useRouter();
  const { userData } = useAuth();

  const lawFirmCode = userData?.lawFirmCode ?? "";
  const userCode    = userData?.uniqueCode   ?? "";
  const userName    = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clients, setClients] = useState<Cliente[]>([]);
  const [lawyers, setLawyers] = useState<Abogado[]>([]);
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [logs,    setLogs]    = useState<TaskLogEntry[]>([]);

  const [showForm,     setShowForm]     = useState(false);
  const [isEditing,    setIsEditing]    = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  /* ────────────────────────── Carga inicial ────────────────────────── */

  useEffect(() => {
    if (!lawFirmCode) return;
    getClientes(lawFirmCode).then(setClients).catch(console.error);
    getTasks(lawFirmCode).then(setTasks).catch(console.error);
  }, [lawFirmCode]);

  useEffect(() => {
    if (!userCode) return;
    /* tipamos explícitamente al miembro del estudio */
    type LawFirmMember = { uniqueCode: string; firstName: string; lastName: string };

    getMyLawFirm(userCode)
      .then((firm) => {
        const list: Abogado[] = firm.members.map((m: LawFirmMember) => ({
          id:     m.uniqueCode,
          nombre: `${m.firstName} ${m.lastName}`,
        }));
        setLawyers(list);
      })
      .catch(console.error);
  }, [userCode]);

  /* ────────────────────────── Helpers ────────────────────────── */

  const fetchTasks = () => {
    if (!lawFirmCode) return;
    getTasks(lawFirmCode).then(setTasks).catch(console.error);
  };

  const fetchLogs = () => {
    if (!lawFirmCode) return;
    getTaskLog(lawFirmCode).then(setLogs).catch(console.error);
  };

  /* ────────────────────────── Acciones UI ────────────────────────── */

  const openNew = () => {
    setSelectedTask(undefined);
    setIsEditing(false);
    setShowForm(true);
    setLogs([]);
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await eliminarTask(id, lawFirmCode, userCode, userName);
    fetchTasks();
  };

  const handleSubmit = async (
    data: Omit<Task, "_id" | "createdAt" | "updatedAt">
  ) => {
    if (isEditing && selectedTask) {
      await modificarTask(
        selectedTask._id,
        data,
        userCode,
        userName,
        lawFirmCode
      );
    } else {
      /* añadimos explícitamente el código del estudio */
      await crearTask(
        { ...data, lawFirmCode },
        userCode,
        userName
      );
    }
    fetchTasks();
    setShowForm(false);
  };

  /* ────────────────────────── Render ───────────────────────── */

  return (
    <div className="container">
      <div className={`card ${styles.taskCard}`}>
        <header className={styles.header}>
          <h2 className={styles.title}>Gestión de Tareas</h2>
          <div className={styles.actions}>
            <button className="btn btn-primary" onClick={openNew}>
              Añadir tarea
            </button>
            <button className="btn btn-secondary" onClick={fetchLogs}>
              Ver registro de actividad
            </button>
            <button className="btn btn-link" onClick={() => router.push("/menu")}>
              ← Volver al menú
            </button>
          </div>
        </header>

        {showForm && (
          <TaskForm
            clients={clients}
            lawyers={lawyers}
            tasks={tasks}
            isEditing={isEditing}
            initialTask={selectedTask}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        <section className={styles.grid}>
          {tasks.map((t) => (
            <TaskCard
              key={t._id}
              task={t}
              clients={clients}
              onEdit={() => openEdit(t)}
              onDelete={() => handleDelete(t._id)}
            />
          ))}
          {tasks.length === 0 && (
            <p className={styles.noTasks}>No hay tareas.</p>
          )}
        </section>

        {logs.length > 0 && <TaskLog logs={logs} />}
      </div>
    </div>
  );
}

export default TaskManager;
