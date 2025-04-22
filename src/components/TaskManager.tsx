// src/components/TaskManager.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getClientes,
  getTasks,
  crearTask,
  modificarTask,
  eliminarTask,
  getTaskLog,
} from "@/lib/api";
import type { Task, Cliente, Abogado, TaskLogEntry } from "@/lib/api/types";
import { TaskForm } from "./TaskManager/TaskForm";
import { TaskCard } from "./TaskManager/TaskCard";
import { TaskDetailsModal } from "./TaskManager/TaskDetailsModal";
import styles from "@/styles/TaskManager.module.css";

export function TaskManager() {
  const router = useRouter();
  const { userData } = useAuth();

  const lawFirmCode = userData?.lawFirmCode ?? "";
  const userCode = userData?.uniqueCode ?? "";
  const userName = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clients, setClients] = useState<Cliente[]>([]);
  const [lawyers, setLawyers] = useState<Abogado[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLogEntry[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const [showDetails, setShowDetails] = useState(false);
  const [detailsTask, setDetailsTask] = useState<Task>();

  useEffect(() => {
    if (!lawFirmCode) return;
    getClientes(lawFirmCode).then(setClients).catch(console.error);
    getTasks(lawFirmCode).then(setTasks).catch(console.error);
  }, [lawFirmCode]);

  useEffect(() => {
    if (!userCode) return;
    import("@/lib/api").then(({ getMyLawFirm }) =>
      getMyLawFirm(userCode)
        .then((firm) => {
          const list: Abogado[] = firm.members.map((m) => ({
            id: m.uniqueCode,
            nombre: `${m.firstName} ${m.lastName}`,
          }));
          setLawyers(list);
        })
        .catch(console.error)
    );
  }, [userCode]);

  const fetchTasks = () => {
    if (!lawFirmCode) return;
    getTasks(lawFirmCode).then(setTasks).catch(console.error);
  };
  const fetchLogs = () => {
    if (!lawFirmCode) return;
    getTaskLog(lawFirmCode).then(setLogs).catch(console.error);
  };

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
      await crearTask({ ...data, lawFirmCode }, userCode, userName);
    }
    fetchTasks();
    setShowForm(false);
  };

  const openDetails = (task: Task) => {
    setDetailsTask(task);
    setShowDetails(true);
  };
  const closeDetails = () => {
    setShowDetails(false);
  };

  return (
    // Usamos sección en lugar de container global
    <section className={styles.taskManagerContainer}>
      <div className={`card ${styles.taskCard}`}>        
        <header className={styles.cardHeader}>
          <h2>Gestión de Tareas</h2>
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

        <div className={styles.taskGrid}>
          {tasks.map((t) => (
            <TaskCard
              key={t._id}
              task={t}
              clients={clients}
              onViewDetails={openDetails}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
          {tasks.length === 0 && <p>No hay tareas.</p>}
        </div>

        {logs.length > 0 && <div className={styles.logSection}>{/* … */}</div>}
      </div>

      {showDetails && detailsTask && (
        <TaskDetailsModal
          task={detailsTask}
          clients={clients}
          lawyers={lawyers}
          onClose={closeDetails}
        />
      )}
    </section>
  );
}

export default TaskManager;
