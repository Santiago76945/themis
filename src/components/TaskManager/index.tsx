// src/components/TaskManager/index.tsx

"use client";

import React, { useState } from "react";
import Menu from "@/components/Menu";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { TaskLog } from "./TaskLog";
import type { Task, Cliente, Abogado, TaskLogEntry } from "@/lib/api/types";

const TaskManager: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // TODO: reemplazar con datos reales
  const tasks: Task[] = [];
  const clients: Cliente[] = [];
  const lawyers: Abogado[] = [];
  const logs: TaskLogEntry[] = [];

  return (
    <div className="container mx-auto p-4">
      <Menu userData={null} onLogout={() => {}} />
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Crear Tarea
        </button>
        <button className="btn btn-secondary ml-2" onClick={() => setShowLog(v => !v)}>
          {showLog ? "Ocultar Registro" : "Ver Registro"}
        </button>
      </div>

      {showForm && (
        <TaskForm
          clients={clients}
          lawyers={lawyers}
          tasks={tasks}
          isEditing={false}
          initialTask={undefined}
          onSubmit={async () => {}}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((t) => (
          <TaskCard
            key={t._id}
            task={t}
            clients={clients}
            onEdit={task => setSelectedTask(task)}
            onDelete={id => console.log("Eliminar", id)}
            onViewDetails={task => setSelectedTask(task)}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          clients={clients}
          lawyers={lawyers}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {showLog && <TaskLog logs={logs} />}
    </div>
  );
};

export default TaskManager;
