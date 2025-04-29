// src/components/ClientManager/index.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Cliente, LogEntry } from "@/lib/api/types";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import ClientLogs from "./ClientLogs";

export default function ClientManager() {
  const { userData } = useAuth();
  const lawFirmCode = userData?.lawFirmCode || "";
  const userCode = userData?.uniqueCode || "";
  const userName = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clients, setClients] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Fetch all clients for this law firm
  const fetchClients = useCallback(async () => {
    if (!lawFirmCode) return;
    // TODO: implementar fetch de clientes y setClients(resp)
  }, [lawFirmCode]);

  // Fetch activity log
  const fetchClientLogs = useCallback(async () => {
    if (!lawFirmCode) return;
    // TODO: implementar fetch de logs y setLogs(resp); setShowLogs(true)
  }, [lawFirmCode]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Handlers
  const handleSelect = (client: Cliente) => {
    setSelectedClient(client);
    setFormData(client);
    setIsEditing(true);
    setShowLogs(false);
  };
  const handleAddClick = () => {
    setSelectedClient(null);
    setFormData({});
    setIsEditing(true);
    setShowLogs(false);
  };
  const handleSave = async (data: Partial<Cliente>) => {
    // TODO: create or update client via API, then refetch
  };
  const handleCancel = () => {
    setFormData({});
    setSelectedClient(null);
    setIsEditing(false);
  };

  return (
    <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
      <ClientList
        clients={clients}
        selectedClient={selectedClient}
        onSelect={handleSelect}
        onAddClick={handleAddClick}
      />

      <section className="md:col-span-2">
        {isEditing ? (
          <ClientForm
            initialData={formData}
            onChange={setFormData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : showLogs ? (
          <ClientLogs logs={logs} />
        ) : (
          <p>Seleccione un cliente o haga clic en “Agregar cliente” para comenzar.</p>
        )}
      </section>
    </div>
  );
}