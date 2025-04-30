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
          {cliente ? cliente.name : "Desconocido"}
        </p>
        <p>
          <strong>Rol:</strong> {caso.rol}
        </p>
        <p>
          <strong>Tipo de Caso:</strong> {caso.caseType === "propio" ? "Propio" : "Delegado"}
        </p>
        <p>
          <strong>Honorarios Estimados:</strong>{" "}
          {caso.honorariosEstimados != null
            ? caso.honorariosEstimados.toLocaleString("es-AR", { style: "currency", currency: "ARS" })
            : "—"}
        </p>
        <p>
          <strong>Referencia:</strong> {caso.referencia}
        </p>
        <p>
          <strong>Número de Expediente:</strong> {caso.numeroExpediente || "—"}
        </p>
        <p>
          <strong>Carátula:</strong> {caso.caratula || "—"}
        </p>
        <p>
          <strong>Juzgado / Tribunal:</strong> {caso.tribunal || "—"}
        </p>
        <p>
          <strong>Estado:</strong> {caso.estado || "—"}
        </p>
        <p>
          <strong>Próxima Tarea:</strong> {caso.proximaTarea || "—"}
        </p>
        <p>
          <strong>Fecha Próxima Tarea:</strong>{" "}
          {caso.fechaProximaTarea
            ? new Date(caso.fechaProximaTarea).toLocaleDateString("es-AR")
            : "—"}
        </p>
        <p>
          <strong>Prioridad:</strong> {caso.prioridad}
        </p>
        <p>
          <strong>Observaciones:</strong> {caso.observaciones || "—"}
        </p>
        <hr className="divider" />
        <p>
          <strong>Creado:</strong>{" "}
          {new Date(caso.createdAt).toLocaleString("es-AR")}
        </p>
        <p>
          <strong>Actualizado:</strong>{" "}
          {new Date(caso.updatedAt).toLocaleString("es-AR")}
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
