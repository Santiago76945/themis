// src/components/GestionCasos.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/GestionCasos.module.css";
import { Cliente, CasoData, LogEntry } from "@/lib/api";

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
}

interface Props {
  clientes: Cliente[];
  casos?: Caso[];
  onCrear: (clienteId: string, data: CasoData) => void;
  onModificar: (casoId: string, data: CasoData) => void;
  onEliminar: (casoId: string) => void;
  log: LogEntry[];
}

export default function GestionCasos({
  clientes,
  casos = [],
  onCrear,
  onModificar,
  onEliminar,
  log,
}: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [clienteSel, setClienteSel] = useState("");
  const [form, setForm] = useState<CasoData>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!clientes.length) {
      setClienteSel("");
    }
  }, [clientes]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    if (!clienteSel) return;
    onCrear(clienteSel, form);
    setForm({});
    setShowForm(false);
  };

  const casosFiltrados = casos.filter((c) => {
    const cli = clientes.find((x) => x.id === c.clienteId);
    return cli
      ? cli.lastName.toLowerCase().includes(searchTerm.trim().toLowerCase())
      : false;
  });

  return (
    <div className="container">
      <div className="card">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Gestión de Casos</h2>
          <div className={styles.actionsHeader}>
            <button className="btn btn-link" onClick={() => router.push("/menu")}>
              Volver al menú
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cancelar" : "Añadir caso"}
            </button>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="card-secondary">
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className={styles.field}>
                <label htmlFor="cliente">Cliente</label>
                <select
                  id="cliente"
                  name="cliente"
                  className="input"
                  value={clienteSel}
                  onChange={(e) => setClienteSel(e.target.value)}
                >
                  <option value="">-- seleccioná un cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className={styles.field}>
                <label htmlFor="fechaProximaAccion">Fecha de Próxima Acción</label>
                <input
                  id="fechaProximaAccion"
                  name="fechaProximaAccion"
                  type="date"
                  className="input"
                  value={form.fechaProximaAccion || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="fechaInicioJuicio">Fecha de Inicio del Juicio</label>
                <input
                  id="fechaInicioJuicio"
                  name="fechaInicioJuicio"
                  type="date"
                  className="input"
                  value={form.fechaInicioJuicio || ""}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="responsables">Responsable/s</label>
                <input
                  id="responsables"
                  name="responsables"
                  className="input"
                  value={form.responsables || ""}
                  onChange={handleChange}
                />
              </div>

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

        {/* Buscador */}
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Buscar por apellido"
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de casos */}
        <div className={styles.caseList}>
          {casosFiltrados.map((c) => {
            const cli = clientes.find((x) => x.id === c.clienteId);
            return (
              <div key={c._id} className="card-secondary">
                <strong>
                  {cli ? `${cli.firstName} ${cli.lastName}` : "Cliente desconocido"}
                </strong>
                <p>Referencia: {c.referencia}</p>
                <p>Expediente: {c.numeroExpediente}</p>
                <p>Prioridad: {c.prioridad}</p>
                <p>Etapa: {c.etapaProcesal}</p>
                <p>Próx. Acción: {c.proximaAccion}</p>
                <p>Inicio Juicio: {c.fechaInicioJuicio}</p>
                <p>Responsable/s: {c.responsables}</p>
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
          {casosFiltrados.length === 0 && <p>No se encontraron casos.</p>}
        </div>
      </div>
    </div>
  );
}
