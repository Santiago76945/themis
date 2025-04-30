// src/components/ClientManager/ClientDetailsModal.tsx

"use client";

import React from "react";
import type { Cliente } from "@/lib/api/types";

interface ClientDetailsModalProps {
  client: Cliente;
  onClose: () => void;
  onEdit: (client: Cliente) => void;
  onDelete: (id: string) => void;
}

export default function ClientDetailsModal({
  client,
  onClose,
  onEdit,
  onDelete,
}: ClientDetailsModalProps) {
  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="text-xl font-bold mb-4">Detalles del Cliente</h2>

        <p><strong>ID Cliente:</strong> {client.id}</p>
        <p><strong>Nombre / Razón Social:</strong> {client.name}</p>
        <p><strong>DNI / CUIT:</strong> {client.dni || "—"}</p>
        <p><strong>Teléfono:</strong> {client.phone || "—"}</p>
        <p><strong>Email:</strong> {client.email || "—"}</p>
        <p><strong>Dirección:</strong> {client.address || "—"}</p>
        <p>
          <strong>Fecha de alta:</strong>{" "}
          {client.dateOfAlta
            ? new Date(client.dateOfAlta).toLocaleDateString("es-AR")
            : "—"}
        </p>
        <p><strong>Observaciones:</strong> {client.clientObservations || "—"}</p>

        <div className="modalFooter">
          <button
            className="btn btn-primary"
            onClick={() => onEdit(client)}
          >
            Modificar
          </button>
          <button
            className="btn btn-secondary ml-2"
            onClick={() => onDelete(client.id)}
          >
            Eliminar
          </button>
          <button
            className="btn btn-link ml-2"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
