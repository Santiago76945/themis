// src/components/GestionCasos.tsx

"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyLawFirm } from "@/lib/api";
import type { Cliente, CasoData, LogEntry, LawFirm } from "@/lib/api/types";
import styles from "@/styles/GestionCasos.module.css";

/* ------------------------------------------------------------------ */
/*  Tipos auxiliares                                                  */
/* ------------------------------------------------------------------ */

// Abogado tal como lo usaremos en la UI
interface Abogado {
  id: string;
  nombre: string;
}

// Representación mínima de un caso para la grilla
interface Caso {
  _id: string;
  clienteId: string;
  referencia?: string;
  numeroExpediente?: string;
  prioridad?: "Alta" | "Media" | "Baja";
  descripcion?: string;
  tribunal?: string;
  etapaProcesal?: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
  fechaInicioJuicio?: string;
  responsables?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  clientes: Cliente[];
  casos?: Caso[];
  onCrear: (clienteId: string, data: CasoData) => void;
  onModificar: (casoId: string, data: CasoData) => void;
  onEliminar: (casoId: string) => void;
  log: LogEntry[];
}

/* ------------------------------------------------------------------ */
/*  Componente principal                                              */
/* ------------------------------------------------------------------ */

export default function GestionCasos({
  clientes,
  casos = [],
  onCrear,
  onModificar,
  onEliminar,
  log,
}: Props) {
  const router = useRouter();
  const { userData } = useAuth();

  const userCode = userData?.uniqueCode ?? "";

  /* --------------------------  State  ----------------------------- */

  const [showForm, setShowForm] = useState(false);
  const [clienteSel, setClienteSel] = useState<string>("");
  const [form, setForm] = useState<CasoData>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<"" | "Alta" | "Media" | "Baja">("");
  const [abogados, setAbogados] = useState<Abogado[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  /* --------------------  Cargar abogados del estudio  ------------- */

  useEffect(() => {
    if (!userCode) return;

    getMyLawFirm(userCode)
      .then((firm: LawFirm) => {
        const list: Abogado[] = firm.members.map((m) => ({
          id: m.uniqueCode,
          nombre: `${m.firstName} ${m.lastName}`,
        }));
        setAbogados(list);
      })
      .catch((err) =>
        console.error("Error al obtener abogados desde getMyLawFirm:", err)
      );
  }, [userCode]);

  /* ----  Reset del formulario si se borran todos los clientes  ---- */

  useEffect(() => {
    if (clientes.length === 0) {
      setClienteSel("");
      setShowForm(false);
    }
  }, [clientes]);

  /* -------------------------  Handlers  --------------------------- */

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev: CasoData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!clienteSel) return;
    onCrear(clienteSel, form);
    setForm({});
    setShowForm(false);
  };

  /* -------------------------  Filtros  ---------------------------- */

  const casosFiltrados = casos.filter((c) => {
    const cli = clientes.find((x) => x.id === c.clienteId);
    const matchName = cli
      ? cli.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchPriority = !priorityFilter || c.prioridad === priorityFilter;
    return matchName && matchPriority;
  });

  /* --------------------------  Render  ---------------------------- */

  return (
    <div className="container">
      <div className="card">

        {/* ───────────  Encabezado  ─────────── */}
        <header className={styles.header}>
          <h2 className={styles.title}>Gestión de Casos</h2>
          <button
            className="btn btn-secondary"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancelar" : "Añadir caso"}
          </button>
        </header>

        {/* ───────────  Formulario  ─────────── */}
        {showForm && (
          <div className="card-secondary">
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Cliente */}
              <div className={styles.field}>
                <label htmlFor="cliente">Cliente*</label>
                <select
                  id="cliente"
                  name="clienteId"
                  className="input"
                  value={clienteSel}
                  onChange={(e) => setClienteSel(e.target.value)}
                  required
                >
                  <option value="">-- seleccioná un cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Referencia */}
              <div className={styles.field}>
                <label htmlFor="referencia">Referencia</label>
                <input
                  id="referencia"
                  name="referencia"
                  className="input"
                  value={form.referencia || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Número de expediente */}
              <div className={styles.field}>
                <label htmlFor="numeroExpediente">N° Expediente</label>
                <input
                  id="numeroExpediente"
                  name="numeroExpediente"
                  className="input"
                  value={form.numeroExpediente || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Prioridad */}
              <div className={styles.field}>
                <label htmlFor="prioridad">Prioridad</label>
                <select
                  id="prioridad"
                  name="prioridad"
                  className="input"
                  value={form.prioridad || ""}
                  onChange={handleChange}
                >
                  <option value="">--</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              {/* Descripción */}
              <div className={styles.fieldFull}>
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  className="input"
                  value={form.descripcion || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Tribunal */}
              <div className={styles.field}>
                <label htmlFor="tribunal">Tribunal</label>
                <input
                  id="tribunal"
                  name="tribunal"
                  className="input"
                  value={form.tribunal || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Etapa procesal */}
              <div className={styles.field}>
                <label htmlFor="etapaProcesal">Etapa Procesal Actual</label>
                <input
                  id="etapaProcesal"
                  name="etapaProcesal"
                  className="input"
                  value={form.etapaProcesal || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Próxima acción */}
              <div className={styles.field}>
                <label htmlFor="proximaAccion">Próxima Acción Esperada</label>
                <input
                  id="proximaAccion"
                  name="proximaAccion"
                  className="input"
                  value={form.proximaAccion || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha próxima acción */}
              <div className={styles.field}>
                <label htmlFor="fechaProximaAccion">Fecha Próx. Acción</label>
                <input
                  id="fechaProximaAccion"
                  name="fechaProximaAccion"
                  type="date"
                  className="input"
                  value={form.fechaProximaAccion || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha inicio juicio */}
              <div className={styles.field}>
                <label htmlFor="fechaInicioJuicio">Fecha Inicio Juicio</label>
                <input
                  id="fechaInicioJuicio"
                  name="fechaInicioJuicio"
                  type="date"
                  className="input"
                  value={form.fechaInicioJuicio || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Responsable/s */}
              <div className={styles.field}>
                <label htmlFor="responsables">Responsable/s</label>
                <select
                  id="responsables"
                  name="responsables"
                  className="input"
                  value={form.responsables || ""}
                  onChange={handleChange}
                >
                  <option value="">-- seleccioná abogado --</option>
                  {abogados.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Acciones del formulario */}
              <div className={styles.actionsForm}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!clienteSel}
                >
                  Crear caso
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ───────────  Filtros  ─────────── */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por apellido"
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value as "Alta" | "Media" | "Baja" | ""
              )
            }
          >
            <option value="">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* ───────────  Lista de casos  ─────────── */}
        <div className={styles.caseList}>
          {casosFiltrados.map((c) => {
            const cli = clientes.find((x) => x.id === c.clienteId);
            return (
              <div key={c._id} className="card-secondary">
                <strong>
                  {cli
                    ? `${cli.firstName} ${cli.lastName}`
                    : "Cliente desconocido"}
                </strong>
                <p>Referencia: {c.referencia || "—"}</p>
                <p>Expediente: {c.numeroExpediente || "—"}</p>
                <p>Prioridad: {c.prioridad || "—"}</p>
                <p>Etapa: {c.etapaProcesal || "—"}</p>
                <p>Próx. Acción: {c.proximaAccion || "—"}</p>
                <p>Inicio Juicio: {c.fechaInicioJuicio || "—"}</p>
                <p>Responsable/s: {c.responsables || "—"}</p>

                <div className={styles.caseActions}>
                  <button
                    className="btn btn-link"
                    onClick={() => onModificar(c._id, c)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-link"
                    onClick={() => onEliminar(c._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
          {casosFiltrados.length === 0 && (
            <p className="mt-2">No se encontraron casos.</p>
          )}
        </div>

        {/* ───────────  Registro de actividad  ─────────── */}
        {showLogs && (
          <div className="card-secondary">
            <h3>Registro de Casos</h3>
            {log.length > 0 ? (
              <ul className={styles.logList}>
                {log.map((entry, i) => (
                  <li key={i}>
                    <small>{entry.fecha}</small> –{" "}
                    <strong>{entry.usuario}</strong> {entry.accion}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay registros aún.</p>
            )}
          </div>
        )}

        {/* ───────────  Acciones al pie  ─────────── */}
        <footer className={styles.bottomActions}>
          <button
            className="btn btn-link"
            onClick={() => setShowLogs((v) => !v)}
          >
            Ver registro de actividad
          </button>
          <button
            className="btn btn-link"
            onClick={() => router.push("/menu")}
          >
            Volver al menú
          </button>
        </footer>
      </div>
    </div>
  );
}

