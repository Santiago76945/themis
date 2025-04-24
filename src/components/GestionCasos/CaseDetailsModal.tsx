// src/components/GestionCasos/CaseDetailsModal.tsx

"use client";

import React from "react";
import type { Cliente, Caso } from "@/lib/api/types";

interface CaseDetailsModalProps {
  caso: Caso;
  clientes: Cliente[];
  onClose: () => void;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  caso,
  clientes,
  onClose,
}) => {
  const cliente = clientes.find((c) => c.id === caso.clienteId);

  return (
    <div className="modal">
      <div className="modalContent">
        <h2 className="text-xl font-bold mb-4">Detalles del Caso</h2>

        <p>
          <strong>Cliente:</strong>{" "}
          {cliente
            ? `${cliente.firstName} ${cliente.lastName}`
            : "Desconocido"}
        </p>
        <p>
          <strong>Referencia:</strong> {caso.referencia || "—"}
        </p>
        <p>
          <strong>Expediente:</strong> {caso.numeroExpediente || "—"}
        </p>
        <p>
          <strong>Prioridad:</strong> {caso.prioridad || "—"}
        </p>
        <p>
          <strong>Descripción:</strong> {caso.descripcion || "—"}
        </p>
        <p>
          <strong>Tribunal:</strong> {caso.tribunal || "—"}
        </p>
        <p>
          <strong>Etapa procesal:</strong> {caso.etapaProcesal || "—"}
        </p>
        <p>
          <strong>Próxima acción:</strong> {caso.proximaAccion || "—"}
        </p>
        <p>
          <strong>Fecha Próx. Acción:</strong>{" "}
          {caso.fechaProximaAccion
            ? new Date(caso.fechaProximaAccion).toLocaleDateString("es-AR")
            : "—"}
        </p>
        <p>
          <strong>Fecha Inicio Juicio:</strong>{" "}
          {caso.fechaInicioJuicio
            ? new Date(caso.fechaInicioJuicio).toLocaleDateString("es-AR")
            : "—"}
        </p>
        <p>
          <strong>Responsable/s:</strong> {caso.responsables || "—"}
        </p>
        <p>
          <strong>Creado:</strong>{" "}
          {caso.createdAt
            ? new Date(caso.createdAt).toLocaleString("es-AR")
            : "—"}
        </p>
        <p>
          <strong>Actualizado:</strong>{" "}
          {caso.updatedAt
            ? new Date(caso.updatedAt).toLocaleString("es-AR")
            : "—"}
        </p>

        <div className="modalFooter">
          <button className="btn btn-link" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsModal;
