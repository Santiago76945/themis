// src/components/GestionCasos/Form.tsx

"use client";

import React, { FormEvent, ChangeEvent } from "react";
import type { Cliente, CasoData } from "@/lib/api/types";
import styles from "@/styles/GestionCasos.module.css";

interface FormProps {
  clientes: Cliente[];
  clienteSel: string;
  formValues: Partial<CasoData>;
  onClienteChange: (clienteId: string) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: FormEvent) => void;
  isEditing: boolean;
}

export const Form: React.FC<FormProps> = ({
  clientes,
  clienteSel,
  formValues,
  onClienteChange,
  onChange,
  onSubmit,
  isEditing,
}) => {
  return (
    <div className="card-secondary">
      <form className={styles.form} onSubmit={onSubmit}>
        {/* Cliente */}
        <div className={styles.field}>
          <label htmlFor="clienteId">Cliente*</label>
          <select
            id="clienteId"
            name="clienteId"
            className="input"
            value={clienteSel}
            onChange={(e) => onClienteChange(e.target.value)}
            required
          >
            <option value="">-- seleccioná un cliente --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rol */}
        <div className={styles.field}>
          <label htmlFor="rol">Rol*</label>
          <input
            id="rol"
            name="rol"
            type="text"
            className="input"
            value={formValues.rol || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* Tipo de Caso */}
        <div className={styles.field}>
          <label htmlFor="caseType">Tipo de Caso*</label>
          <select
            id="caseType"
            name="caseType"
            className="input"
            value={formValues.caseType || ""}
            onChange={onChange}
            required
          >
            <option value="">-- seleccioná tipo --</option>
            <option value="propio">Caso propio</option>
            <option value="delegado">Delegado</option>
          </select>
        </div>

        {/* Honorarios estimados */}
        <div className={styles.field}>
          <label htmlFor="honorariosEstimados">Honorarios estimados</label>
          <input
            id="honorariosEstimados"
            name="honorariosEstimados"
            type="number"
            step="0.01"
            className="input"
            value={formValues.honorariosEstimados ?? ""}
            onChange={onChange}
          />
        </div>

        {/* Referencia */}
        <div className={styles.field}>
          <label htmlFor="referencia">Referencia*</label>
          <input
            id="referencia"
            name="referencia"
            type="text"
            className="input"
            value={formValues.referencia || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* Número de Expediente */}
        <div className={styles.field}>
          <label htmlFor="numeroExpediente">Número de Expediente</label>
          <input
            id="numeroExpediente"
            name="numeroExpediente"
            type="text"
            className="input"
            value={formValues.numeroExpediente || ""}
            onChange={onChange}
          />
        </div>

        {/* Carátula */}
        <div className={styles.field}>
          <label htmlFor="caratula">Carátula</label>
          <input
            id="caratula"
            name="caratula"
            type="text"
            className="input"
            value={formValues.caratula || ""}
            onChange={onChange}
          />
        </div>

        {/* Juzgado / Tribunal */}
        <div className={styles.field}>
          <label htmlFor="tribunal">Juzgado / Tribunal</label>
          <input
            id="tribunal"
            name="tribunal"
            type="text"
            className="input"
            value={formValues.tribunal || ""}
            onChange={onChange}
          />
        </div>

        {/* Estado */}
        <div className={styles.field}>
          <label htmlFor="estado">Estado</label>
          <input
            id="estado"
            name="estado"
            type="text"
            className="input"
            value={formValues.estado || ""}
            onChange={onChange}
          />
        </div>

        {/* Próxima tarea */}
        <div className={styles.field}>
          <label htmlFor="proximaTarea">Próxima tarea</label>
          <input
            id="proximaTarea"
            name="proximaTarea"
            type="text"
            className="input"
            value={formValues.proximaTarea || ""}
            onChange={onChange}
          />
        </div>

        {/* Fecha próxima tarea */}
        <div className={styles.field}>
          <label htmlFor="fechaProximaTarea">Fecha próxima tarea</label>
          <input
            id="fechaProximaTarea"
            name="fechaProximaTarea"
            type="date"
            className="input"
            value={formValues.fechaProximaTarea || ""}
            onChange={onChange}
          />
        </div>

        {/* Prioridad */}
        <div className={styles.field}>
          <label htmlFor="prioridad">Prioridad*</label>
          <select
            id="prioridad"
            name="prioridad"
            className="input"
            value={formValues.prioridad || ""}
            onChange={onChange}
            required
          >
            <option value="">--</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Observaciones */}
        <div className={styles.fieldFull}>
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={3}
            className="input"
            value={formValues.observaciones || ""}
            onChange={onChange}
          />
        </div>

        {/* Acciones del formulario */}
        <div className={styles.actionsForm}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !clienteSel ||
              !formValues.rol ||
              !formValues.caseType ||
              !formValues.referencia ||
              !formValues.prioridad
            }
          >
            {isEditing ? "Guardar Cambios" : "Crear Caso"}
          </button>
        </div>
      </form>
    </div>
  );
};
