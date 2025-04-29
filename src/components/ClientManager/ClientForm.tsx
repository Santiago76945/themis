// src/components/ClientManager/ClientForm.tsx

"use client";

import React, { ChangeEvent } from "react";
import type { Cliente } from "@/lib/api/types";
import styles from "@/styles/Clients.module.css";

interface ClientFormProps {
  initialData: Partial<Cliente>;
  onChange: (data: Partial<Cliente>) => void;
  onSave: (data: Partial<Cliente>) => void;
  onCancel: () => void;
}

export default function ClientForm({
  initialData,
  onChange,
  onSave,
  onCancel,
}: ClientFormProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...initialData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialData);
  };

  return (
    <div className="card">
      <h3>{initialData.id ? "Editar Cliente" : "Crear Cliente"}</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ID (solo en edición) */}
        {initialData.id && (
          <div className={styles.field}>
            <label>ID Cliente</label>
            <input
              type="text"
              className="input"
              value={initialData.id}
              disabled
            />
          </div>
        )}

        {/* Nombre / Razón Social */}
        <div className={styles.field}>
          <label htmlFor="name">Nombre / Razón Social*</label>
          <input
            id="name"
            name="name"
            type="text"
            className="input"
            required
            value={initialData.name || ""}
            onChange={handleChange}
          />
        </div>

        {/* DNI / CUIT */}
        <div className={styles.field}>
          <label htmlFor="dni">DNI / CUIT</label>
          <input
            id="dni"
            name="dni"
            type="text"
            className="input"
            value={initialData.dni || ""}
            onChange={handleChange}
          />
        </div>

        {/* Teléfono */}
        <div className={styles.field}>
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="input"
            value={initialData.phone || ""}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            value={initialData.email || ""}
            onChange={handleChange}
          />
        </div>

        {/* Dirección */}
        <div className={styles.field}>
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            name="address"
            type="text"
            className="input"
            value={initialData.address || ""}
            onChange={handleChange}
          />
        </div>

        {/* Fecha de alta */}
        <div className={styles.field}>
          <label htmlFor="dateOfAlta">Fecha de alta</label>
          <input
            id="dateOfAlta"
            name="dateOfAlta"
            type="date"
            className="input"
            value={initialData.dateOfAlta || ""}
            onChange={handleChange}
          />
        </div>

        {/* Observaciones */}
        <div className={styles.fieldFull}>
          <label htmlFor="clientObservations">Observaciones</label>
          <textarea
            id="clientObservations"
            name="clientObservations"
            rows={3}
            className="input"
            value={initialData.clientObservations || ""}
            onChange={handleChange}
          />
        </div>

        {/* Botones de acción */}
        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary">
            {initialData.id ? "Guardar Cambios" : "Crear Cliente"}
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
  );
}
