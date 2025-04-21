// src/components/TaskManager/TaskForm.tsx

"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import type {
  Task,
  Cliente,
  Abogado,
  Dependency,
} from "@/lib/api/types";
import styles from "@/styles/TaskManager.module.css";

interface TaskFormProps {
  clients: Cliente[];
  lawyers: Abogado[];
  tasks:   Task[];
  isEditing:   boolean;
  initialTask: Task | undefined;
  onSubmit: (
    data: Omit<Task, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  clients,
  lawyers,
  tasks,
  isEditing,
  initialTask,
  onSubmit,
  onCancel,
}) => {
  /* ────────────────────────── estado ────────────────────────── */
  const [formValues, setFormValues] = useState<
    Omit<Task, "_id" | "createdAt" | "updatedAt">
  >(
    () =>
      initialTask
        ? { ...initialTask }
        : {
            /* valores por defecto */
            lawFirmCode: "",
            createdBy: "",
            createdByName: "",
            name: "",
            description: "",
            clienteId: "",
            numeroExpediente: "",
            prioridadProcesal: "Media",
            prioridadComercial: "Media",
            principalResponsables: [],
            coResponsables: [],
            dependencies: [],
            attachments: [],
            comments: [],
            deadline: "",
            estimatedTime: "",
            estado: "pendiente",
          }
  );

  /* reactualiza si cambia la tarea a editar */
  useEffect(() => {
    if (initialTask) setFormValues({ ...initialTask });
  }, [initialTask]);

  /* ────────────────────────── handlers ────────────────────────── */

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCoResponsable = (id: string) => {
    setFormValues((prev) => {
      const list = prev.coResponsables.includes(id)
        ? prev.coResponsables.filter((x) => x !== id)
        : [...prev.coResponsables, id];
      return { ...prev, coResponsables: list };
    });
  };

  const toggleDependency = (taskId: string) => {
    setFormValues((prev) => {
      const exists = prev.dependencies.find((d) => d.taskId === taskId);

      /* 🔑  aseguramos el tipo correcto  */
      const newDependencies: Dependency[] = exists
        ? prev.dependencies.filter((d) => d.taskId !== taskId)
        : [...prev.dependencies, { taskId, type: "espera" }];

      return { ...prev, dependencies: newDependencies };
    });
  };

  const changeDepType = (
    taskId: string,
    type: Dependency["type"]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      dependencies: prev.dependencies.map((d) =>
        d.taskId === taskId ? { ...d, type } : d
      ),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  /* ────────────────────────── UI ────────────────────────── */

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className={styles.formField}>
            <label>Tarea*</label>
            <input
              name="name"
              className="input"
              value={formValues.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
          <div className={styles.formFieldFull}>
            <label>Descripción</label>
            <textarea
              name="description"
              className="input"
              rows={3}
              value={formValues.description}
              onChange={handleChange}
            />
          </div>

          {/* Cliente */}
          <div className={styles.formField}>
            <label>Cliente</label>
            <select
              name="clienteId"
              className="input"
              value={formValues.clienteId}
              onChange={handleChange}
            >
              <option value="">-- sin cliente --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Nº de expediente */}
          <div className={styles.formField}>
            <label>Nº de expediente</label>
            <input
              name="numeroExpediente"
              className="input"
              value={formValues.numeroExpediente}
              onChange={handleChange}
            />
          </div>

          {/* Prioridades */}
          <div className={styles.formField}>
            <label>Prioridad Procesal*</label>
            <select
              name="prioridadProcesal"
              className="input"
              value={formValues.prioridadProcesal}
              onChange={handleChange}
              required
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label>Prioridad Comercial*</label>
            <select
              name="prioridadComercial"
              className="input"
              value={formValues.prioridadComercial}
              onChange={handleChange}
              required
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          {/* Responsable principal */}
          <div className={styles.formField}>
            <label>Responsable Principal</label>
            <select
              name="principalResponsables"
              className="input"
              value={formValues.principalResponsables[0] ?? ""}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  principalResponsables: e.target.value
                    ? [e.target.value]
                    : [],
                }))
              }
            >
              <option value="">--</option>
              {lawyers.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Co‑responsables */}
          <div className={styles.formField}>
            <label>Co‑responsables</label>
            {lawyers.map((a) => (
              <label key={a.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formValues.coResponsables.includes(a.id)}
                  onChange={() => toggleCoResponsable(a.id)}
                />
                {a.nombre}
              </label>
            ))}
          </div>

          {/* Dependencias */}
          <div className={styles.formField}>
            <label>Dependencias</label>
            {tasks
              .filter(
                (t) =>
                  t._id !== initialTask?._id && t.estado !== "finalizada"
              )
              .map((t) => (
                <div key={t._id} className={styles.depRow}>
                  <input
                    type="checkbox"
                    checked={
                      !!formValues.dependencies.find(
                        (d) => d.taskId === t._id
                      )
                    }
                    onChange={() => toggleDependency(t._id)}
                  />
                  {t.name}
                  {formValues.dependencies.find(
                    (d) => d.taskId === t._id
                  ) && (
                    <select
                      value={
                        formValues.dependencies.find(
                          (d) => d.taskId === t._id
                        )?.type
                      }
                      onChange={(e) =>
                        changeDepType(
                          t._id,
                          e.target.value as Dependency["type"]
                        )
                      }
                    >
                      <option value="espera">Espera finalización</option>
                      <option value="retraso">Retrasa</option>
                    </select>
                  )}
                </div>
              ))}
          </div>

          {/* Deadline */}
          <div className={styles.formField}>
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              className="input"
              value={formValues.deadline?.slice(0, 10) || ""}
              onChange={handleChange}
            />
          </div>

          {/* Tiempo estimado */}
          <div className={styles.formField}>
            <label>Tiempo estimado</label>
            <input
              name="estimatedTime"
              className="input"
              value={formValues.estimatedTime}
              onChange={handleChange}
              placeholder="p.e. 2h, 3 días"
            />
          </div>

          {/* Estado */}
          <div className={styles.formField}>
            <label>Estado</label>
            <select
              name="estado"
              className="input"
              value={formValues.estado}
              onChange={handleChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="comenzada">Comenzada</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>

          {/* Acciones */}
          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Guardar cambios" : "Crear tarea"}
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
