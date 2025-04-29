// src/components/GestionCasos/Form.tsx

"use client";

import React, { FormEvent, ChangeEvent } from "react";
import type { Cliente, CasoData } from "@/lib/api/types";
import styles from "@/styles/GestionCasos.module.css";

interface FormProps {
  clientes: Cliente[];
  clienteSel: string;
  formValues: CasoData;
  onClienteChange: (clienteId: string) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: FormEvent) => void;
  isEditing: boolean;  // <-- agregado
}

export const Form: React.FC<FormProps> = ({
  clientes,
  clienteSel,
  formValues,
  onClienteChange,
  onChange,
  onSubmit,
  isEditing,         // <-- agregado
}) => {
  return (
    <div className="card-secondary">
      <form className={styles.form} onSubmit={onSubmit}>
        {/* Cliente */}
        <div className={styles.field}>
          <label htmlFor="cliente">Cliente*</label>
          <select
            id="cliente"
            name="clienteId"
            className="input"
            value={clienteSel}
            onChange={(e) => onClienteChange(e.target.value)}
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
            value={formValues.referencia || ""}
            onChange={onChange}
          />
        </div>

        {/* Número de expediente */}
        <div className={styles.field}>
          <label htmlFor="numeroExpediente">N° Expediente</label>
          <input
            id="numeroExpediente"
            name="numeroExpediente"
            className="input"
            value={formValues.numeroExpediente || ""}
            onChange={onChange}
          />
        </div>

        {/* Prioridad */}
        <div className={styles.field}>
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            className="input"
            value={formValues.prioridad || ""}
            onChange={onChange}
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
            value={formValues.descripcion || ""}
            onChange={onChange}
          />
        </div>

        {/* Tribunal */}
        <div className={styles.field}>
          <label htmlFor="tribunal">Tribunal</label>
          <input
            id="tribunal"
            name="tribunal"
            className="input"
            value={formValues.tribunal || ""}
            onChange={onChange}
          />
        </div>

        {/* Etapa procesal */}
        <div className={styles.field}>
          <label htmlFor="etapaProcesal">Etapa Procesal Actual</label>
          <input
            id="etapaProcesal"
            name="etapaProcesal"
            className="input"
            value={formValues.etapaProcesal || ""}
            onChange={onChange}
          />
        </div>

        {/* Próxima acción */}
        <div className={styles.field}>
          <label htmlFor="proximaAccion">Próxima Acción Esperada</label>
          <input
            id="proximaAccion"
            name="proximaAccion"
            className="input"
            value={formValues.proximaAccion || ""}
            onChange={onChange}
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
            value={formValues.fechaProximaAccion || ""}
            onChange={onChange}
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
            value={formValues.fechaInicioJuicio || ""}
            onChange={onChange}
          />
        </div>

        {/* Responsable/s */}
        <div className={styles.field}>
          <label htmlFor="responsables">Responsable/s</label>
          <input
            id="responsables"
            name="responsables"
            className="input"
            value={formValues.responsables || ""}
            onChange={onChange}
          />
        </div>

        {/* Acciones del formulario */}
        <div className={styles.actionsForm}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!clienteSel}
          >
            {isEditing ? "Guardar cambios" : "Crear caso"}
          </button>
        </div>
      </form>
    </div>
  );
};
