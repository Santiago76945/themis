// src/components/TaskManager/index.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task, Cliente, Abogado, TaskLogEntry } from "@/lib/api/types";
import { TaskCard } from "./TaskCard";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { TaskForm } from "./TaskForm";
import { TaskLog } from "./TaskLog";

export interface TaskManagerProps {
  tasks: Task[];
  clients: Cliente[];
  lawyers: Abogado[];
  logs: TaskLogEntry[];
  onCreate: (data: Omit<Task, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdate: (id: string, data: Omit<Task, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  onDelete: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  clients,
  lawyers,
  logs,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setShowForm(false);
    setShowLogs(false);
  };

  const handleAdd = () => {
    setSelectedTask(null);
    setShowForm(true);
    setShowLogs(false);
  };

  const handleLog = () => {
    setShowLogs((prev) => !prev);
    setShowForm(false);
    setSelectedTask(null);
  };

  const handleEditFromCard = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
    setShowLogs(false);
  };

  const handleDeleteFromCard = (id: string) => {
    onDelete(id);
    setSelectedTask(null);
  };

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Gestión de Tareas</h2>
        </div>
        <div className="card-body flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={handleAdd}>
            Crear Tarea
          </button>
          <button className="btn btn-secondary" onClick={handleLog}>
            {showLogs ? "Ocultar Registro" : "Ver registro de actividad"}
          </button>
          <button className="btn btn-secondary" onClick={() => router.push("/menu")}>
            Volver al menú
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              clients={clients}
              onViewDetails={handleView}
              onEdit={handleEditFromCard}
              onDelete={handleDeleteFromCard}
            />
          ))}
        </div>

        <div className="md:col-span-2">
          {showForm ? (
            <div className="card-secondary">
              <TaskForm
                tasks={tasks}
                isEditing={!!selectedTask}
                clients={clients}
                lawyers={lawyers}
                initialTask={selectedTask || undefined}
                onSubmit={async (data) => {
                  if (selectedTask) await onUpdate(selectedTask._id, data);
                  else await onCreate(data);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          ) : showLogs ? (
            <div className="card-secondary">
              <TaskLog logs={logs} />
            </div>
          ) : selectedTask ? (
            <div className="card-secondary">
              <TaskDetailsModal
                task={selectedTask}
                clients={clients}
                lawyers={lawyers}
                onClose={() => setSelectedTask(null)}
                onEdit={() => handleEditFromCard(selectedTask)}
                onDelete={onDelete}
              />
            </div>
          ) : (
            <p className="mt-2">Seleccioná una tarea o creá una nueva para comenzar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
