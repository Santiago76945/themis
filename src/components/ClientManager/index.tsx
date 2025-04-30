// src/components/ClientManager/index.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Cliente } from "@/lib/api/types";
import {
  getClientes,
  getClientLog,
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/api/clients";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import ClientLogs from "./ClientLogs";
import ClientDetailsModal from "./ClientDetailsModal";

export default function ClientManager() {
  const router = useRouter();
  const { userData } = useAuth();
  const lawFirmCode = userData?.lawFirmCode || "";
  const userCode = userData?.uniqueCode || "";
  const userName = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clients, setClients] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchClients = useCallback(async () => {
    if (!lawFirmCode) return;
    try {
      const resp = await getClientes(lawFirmCode);
      setClients(resp);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  }, [lawFirmCode]);

  const fetchClientLogs = useCallback(async () => {
    if (!lawFirmCode) return;
    try {
      const resp = await getClientLog(lawFirmCode);
      setLogs(resp);
      setShowLogs(true);
      setIsEditing(false);
      setShowDetails(false);
    } catch (err) {
      console.error("Error cargando logs:", err);
    }
  }, [lawFirmCode]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleViewDetails = (client: Cliente) => {
    setSelectedClient(client);
    setShowDetails(true);
    setIsEditing(false);
    setShowLogs(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleEditFromModal = (client: Cliente) => {
    setFormData(client);
    setIsEditing(true);
    setShowDetails(false);
  };

  const handleAddClick = () => {
    setSelectedClient(null);
    setFormData({});
    setIsEditing(true);
    setShowLogs(false);
    setShowDetails(false);
  };

  const handleSave = async (data: Partial<Cliente>) => {
    try {
      if (selectedClient) {
        await updateClient(lawFirmCode, selectedClient.id, data, userCode, userName);
      } else {
        await createClient(lawFirmCode, data as any, userCode, userName);
      }
      setIsEditing(false);
      setFormData({});
      setSelectedClient(null);
      await fetchClients();
    } catch (err) {
      console.error("Error guardando cliente:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(lawFirmCode, id, userCode, userName);
      setIsEditing(false);
      setFormData({});
      setSelectedClient(null);
      await fetchClients();
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    }
  };

  return (
    <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
      <ClientList
        clients={clients}
        selectedClient={selectedClient}
        onViewDetails={handleViewDetails}
        onAddClick={handleAddClick}
      />

      <section className="md:col-span-2">
        <div className="actions mb-2">
          <button className="btn btn-link" onClick={fetchClientLogs}>
            Ver registro de actividad
          </button>
          <button className="btn btn-link" onClick={() => router.push("/menu")}>
            Volver al menú
          </button>
        </div>

        {showDetails && selectedClient && (
          <ClientDetailsModal
            client={selectedClient}
            onClose={handleCloseDetails}
            onEdit={handleEditFromModal}
            onDelete={handleDelete}
          />
        )}

        {isEditing ? (
          <ClientForm
            initialData={formData}
            onChange={setFormData}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setFormData({});
              setSelectedClient(null);
            }}
          />
        ) : showLogs ? (
          <ClientLogs logs={logs} />
        ) : (
          <p>
            Seleccione un cliente o haga clic en “Agregar cliente” para comenzar.
          </p>
        )}
      </section>
    </div>
  );
}
