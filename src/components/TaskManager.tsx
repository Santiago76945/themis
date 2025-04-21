// src/components/TaskManager.tsx
"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
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
  Task,
  TaskLogEntry,
  Cliente,
  Abogado,
} from "@/lib/api";
import styles from "@/styles/TaskManager.module.css";

// Definimos un alias de tipo para las dependencias
type DependencyType = "espera" | "retraso";

export default function TaskManager() {
  const router = useRouter();
  const { userData } = useAuth();
  const lawFirmCode = userData?.lawFirmCode || "";
  const userCode = userData?.uniqueCode || "";
  const userName = `${userData?.firstName || ""} ${userData?.lastName ||
    ""}`.trim();

  const [clients, setClients] = useState<Cliente[]>([]);
  const [lawyers, setLawyers] = useState<Abogado[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLogEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [formValues, setFormValues] = useState<Partial<Task>>({
    lawFirmCode,
    createdBy: userCode,
    createdByName: userName,
    coResponsables: [],
    dependencies: [],
    attachments: [],
    comments: [],
  });

  // Carga inicial de clientes y tareas
  useEffect(() => {
    if (!lawFirmCode) return;
    getClientes(lawFirmCode).then(setClients).catch(console.error);
    getTasks(lawFirmCode).then(setTasks).catch(console.error);
  }, [lawFirmCode]);

  // Carga de abogados desde MyLawFirm → members
  useEffect(() => {
    if (!userCode) return;
    getMyLawFirm(userCode)
      .then((firm) => {
        const list = firm.members.map((m) => ({
          id: m.uniqueCode,
          nombre: `${m.firstName} ${m.lastName}`,
        }));
        setLawyers(list);
      })
      .catch(console.error);
  }, [userCode]);

  const fetchTasks = () => {
    if (!lawFirmCode) return;
    getTasks(lawFirmCode).then(setTasks).catch(console.error);
  };

  const fetchLogs = () => {
    if (!lawFirmCode) return;
    getTaskLog(lawFirmCode).then(setLogs).catch(console.error);
  };

  const openNewForm = () => {
    setFormValues({
      lawFirmCode,
      createdBy: userCode,
      createdByName: userName,
      coResponsables: [],
      dependencies: [],
      attachments: [],
      comments: [],
    });
    setSelectedTask(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setFormValues(task);
    setSelectedTask(task);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormValues({
      lawFirmCode,
      createdBy: userCode,
      createdByName: userName,
      coResponsables: [],
      dependencies: [],
      attachments: [],
      comments: [],
    });
    setSelectedTask(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((f) => ({ ...f, [name]: value }));
  };

  // Co‑responsables
  const toggleCoResponsable = (id: string) => {
    const list = formValues.coResponsables || [];
    setFormValues((f) => ({
      ...f,
      coResponsables: list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id],
    }));
  };

  // Dependencias
  const toggleDependency = (taskId: string) => {
    const list = formValues.dependencies || [];
    setFormValues((f) => ({
      ...f,
      dependencies: list.find((d) => d.taskId === taskId)
        ? list.filter((d) => d.taskId !== taskId)
        : [...list, { taskId, type: "espera" as DependencyType }],
    }));
  };
  const changeDepType = (
    taskId: string,
    type: DependencyType
  ) => {
    setFormValues((f) => ({
      ...f,
      dependencies: (f.dependencies || []).map((d) =>
        d.taskId === taskId ? { ...d, type } : d
      ),
    }));
  };

  // Adjuntos
  const addAttachment = () => {
    const list = formValues.attachments || [];
    setFormValues((f) => ({
      ...f,
      attachments: [...list, { url: "", description: "" }],
    }));
  };
  const updateAttachment = (
    idx: number,
    field: "url" | "description",
    val: string
  ) => {
    setFormValues((f) => {
      const list = f.attachments || [];
      list[idx] = { ...list[idx], [field]: val };
      return { ...f, attachments: [...list] };
    });
  };
  const removeAttachment = (idx: number) => {
    setFormValues((f) => ({
      ...f,
      attachments: (f.attachments || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValues.name) {
      alert("El nombre de la tarea es obligatorio.");
      return;
    }
    try {
      if (isEditing && selectedTask) {
        await modificarTask(
          selectedTask._id!,
          formValues as Partial<
            Omit<
              Task,
              | "_id"
              | "lawFirmCode"
              | "createdBy"
              | "createdByName"
              | "createdAt"
              | "updatedAt"
            >
          >,
          userCode,
          userName,
          lawFirmCode
        );
      } else {
        await crearTask(
          formValues as Omit<Task, "_id" | "createdAt" | "updatedAt">,
          userCode,
          userName
        );
      }
      fetchTasks();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await eliminarTask(taskId, lawFirmCode, userCode, userName);
      fetchTasks();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className={`card ${styles.taskCard}`}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Gestión de Tareas</h2>
          <div className={styles.actions}>
            <button className="btn btn-primary" onClick={openNewForm}>
              Añadir tarea
            </button>
            <button className="btn btn-secondary" onClick={fetchLogs}>
              Ver registro de actividad
            </button>
            <button
              className="btn btn-link"
              onClick={() => router.push("/menu")}
            >
              ← Volver al menú
            </button>
          </div>
        </div>

        {/* Formulario en modal */}
        {showForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Nombre */}
                <div className={styles.formField}>
                  <label>Tarea*</label>
                  <input
                    name="name"
                    className="input"
                    value={formValues.name || ""}
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
                    value={formValues.description || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Cliente */}
                <div className={styles.formField}>
                  <label>Cliente</label>
                  <select
                    name="clienteId"
                    className="input"
                    value={formValues.clienteId || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- sin cliente --</option>
                    {clients.map(c => (
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
                    value={formValues.numeroExpediente || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Prioridades */}
                <div className={styles.formField}>
                  <label>Prioridad Procesal*</label>
                  <select
                    name="prioridadProcesal"
                    className="input"
                    value={formValues.prioridadProcesal || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">--</option>
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
                    value={formValues.prioridadComercial || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">--</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                {/* Responsable Principal */}
                <div className={styles.formField}>
                  <label>Responsable Principal</label>
                  <select
                    name="principalResponsables"
                    className="input"
                    value={formValues.principalResponsables?.[0] || ""}
                    onChange={e => setFormValues(f => ({
                      ...f,
                      principalResponsables: e.target.value ? [e.target.value] : []
                    }))}
                  >
                    <option value="">--</option>
                    {lawyers.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Co‑responsables */}
                <div className={styles.formField}>
                  <label>Co‑responsables</label>
                  {lawyers.map(a => (
                    <label key={a.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formValues.coResponsables?.includes(a.id) || false}
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
                    .filter(t => t._id !== selectedTask?._id && t.estado !== "finalizada")
                    .map(t => (
                      <div key={t._id} className={styles.depRow}>
                        <input
                          type="checkbox"
                          checked={!!formValues.dependencies?.find(d => d.taskId === t._id)}
                          onChange={() => toggleDependency(t._id)}
                        />
                        {t.name}
                        {formValues.dependencies?.find(d => d.taskId === t._id) && (
                          <select
                            value={formValues.dependencies.find(d => d.taskId === t._id)?.type}
                            onChange={e => changeDepType(t._id, e.target.value as DependencyType)}
                          >
                            <option value="espera">Espera finalización</option>
                            <option value="retraso">Retrasa</option>
                          </select>
                        )}
                      </div>
                    ))
                  }
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
                    value={formValues.estimatedTime || ""}
                    onChange={handleChange}
                    placeholder="p.e. 2h, 3 días"
                  />
                </div>

                {/* Documentos adjuntos */}
                <div className={styles.formField}>
                  <label>Documentos adjuntos</label>
                  {(formValues.attachments || []).map((att, idx) => (
                    <div key={idx} className={styles.attachmentRow}>
                      <input
                        placeholder="URL"
                        value={att.url}
                        onChange={e => updateAttachment(idx, "url", e.target.value)}
                        className="input mb-1"
                      />
                      <input
                        placeholder="Descripción*"
                        value={att.description}
                        onChange={e => updateAttachment(idx, "description", e.target.value)}
                        className="input mb-1"
                        required
                      />
                      <button type="button" className="btn btn-link" onClick={() => removeAttachment(idx)}>
                        Eliminar adjunto
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={addAttachment}>
                    + Agregar adjunto
                  </button>
                </div>

                {/* Fecha y hora de creación */}
                <div className={styles.formField}>
                  <label>Creada el</label>
                  <input
                    type="text"
                    className="input"
                    value={
                      formValues.createdAt
                        ? new Date(formValues.createdAt).toLocaleString("es-AR", { timeZone: "America/Argentina/Cordoba" })
                        : ""
                    }
                    disabled
                  />
                </div>

                {/* Creado por */}
                <div className={styles.formField}>
                  <label>Creado por</label>
                  <input
                    type="text"
                    className="input"
                    value={formValues.createdByName || ""}
                    disabled
                  />
                </div>

                {/* Estado */}
                <div className={styles.formField}>
                  <label>Estado</label>
                  <select
                    name="estado"
                    className="input"
                    value={formValues.estado || "pendiente"}
                    onChange={handleChange}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="comenzada">Comenzada</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>

                {/* Acciones del formulario */}
                <div className={styles.formActions}>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Guardar cambios" : "Crear tarea"}
                  </button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>
                    Cancelar
                  </button>
                  {isEditing && selectedTask && (
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={() => handleDelete(selectedTask._id!)}
                    >
                      Eliminar tarea
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grid de tarjetas */}
        <div className={styles.taskGrid}>
          {tasks.map(t => (
            <div key={t._id} className={styles.taskCard}>
              <div className={styles.cardHeader}>
                <h3>{t.name}</h3>
                <small>{t.estado}</small>
              </div>
              <div className={styles.cardContent}>
                {t.description && <p>{t.description}</p>}
                {t.clienteId && (
                  <p>
                    Cliente: {clients.find(c => c.id === t.clienteId)?.lastName ?? "—"}
                  </p>
                )}
              </div>
              <div className={styles.cardActions}>
                <button className="btn btn-link" onClick={() => openEditForm(t)}>
                  Editar
                </button>
                <button className="btn btn-link" onClick={() => handleDelete(t._id!)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p>No hay tareas.</p>}
        </div>

        {/* Registro de actividad */}
        {logs.length > 0 && (
          <div className={styles.logSection}>
            <h3>Registro de tareas</h3>
            {logs.map((l, i) => (
              <div key={i} className={styles.logEntry}>
                <small>
                  {new Date(l.timestamp).toLocaleString("es-AR", {
                    timeZone: "America/Argentina/Cordoba",
                  })}
                </small>{" "}
                – <strong>{l.userName}</strong> {l.action}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}