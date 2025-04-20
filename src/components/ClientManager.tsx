// src/components/ClientManager.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/Clients.module.css";

interface Client {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  dni?: string;
  phone?: string;
  email?: string;
  address?: string;
  additionalInfo?: string;
}

interface ClientLogEntry {
  userName: string;
  action: string;
  timestamp: string;
  clientId: string;
}

export default function ClientManager() {
  const router = useRouter();
  const { userData } = useAuth();
  const lawFirmCode = userData?.uniqueCode || "";
  const userCode     = userData?.uniqueCode || "";
  const userName     = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState<Partial<Client>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [logs, setLogs] = useState<ClientLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Carga inicial de clientes, memoizada para satisfy exhaustive-deps
  const fetchClients = useCallback(async () => {
    if (!lawFirmCode) return;
    const res = await fetch(`/.netlify/functions/getClients?lawFirmCode=${lawFirmCode}`);
    const data = await res.json();
    setClients(data.clients || []);
  }, [lawFirmCode]);

  // Carga global de logs
  const fetchLogs = async () => {
    if (!lawFirmCode) return;
    const res = await fetch(`/.netlify/functions/getClientLog?lawFirmCode=${lawFirmCode}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setShowLogs(true);
  };

  // Ejecuta fetchClients al montar y cuando cambie la firma
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filtrar lista por nombre o apellido
  const filtered = clients.filter(
    (c) =>
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Seleccionar un cliente para edición
  const handleSelect = (c: Client) => {
    setSelected(c);
    setForm(c);
    setIsEditing(true);
    setShowLogs(false);
  };

  // Cambios en formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Crear cliente
  const handleAdd = async () => {
    if (!form.firstName || !form.lastName) {
      alert("Nombre y Apellido son obligatorios");
      return;
    }
    await fetch("/.netlify/functions/createClient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lawFirmCode,
        userCode,
        userName,
        ...form,
      }),
    });
    setForm({});
    setIsEditing(false);
    fetchClients();
  };

  // Actualizar cliente
  const handleUpdate = async () => {
    if (!selected) return;
    await fetch("/.netlify/functions/updateClient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lawFirmCode,
        userCode,
        userName,
        id: selected.id,
        updates: form,
      }),
    });
    setSelected(null);
    setIsEditing(false);
    fetchClients();
  };

  // Eliminar cliente
  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`¿Eliminar a ${selected.firstName} ${selected.lastName}?`)) return;
    await fetch("/.netlify/functions/deleteClient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lawFirmCode,
        userCode,
        userName,
        id: selected.id,
      }),
    });
    setSelected(null);
    setIsEditing(false);
    fetchClients();
  };

  return (
    <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
      <aside className="card">
        <h2>Clientes</h2>

        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          className="input mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="btn btn-link mb-2" onClick={fetchLogs}>
          Ver registro de actividad
        </button>

        <button
          className="btn btn-link mb-2"
          onClick={() => {
            setSelected(null);
            setForm({});
            setIsEditing(true);
            setShowLogs(false);
          }}
        >
          + Agregar cliente
        </button>

        <ul className={styles.clientList}>
          {filtered.map((c) => (
            <li
              key={c._id || c.id}
              className={`${styles.clientListItem} ${
                selected?._id === c._id ? styles.selected : ""
              }`}
              onClick={() => handleSelect(c)}
            >
              {c.firstName} {c.lastName}
            </li>
          ))}
        </ul>

        <button className="btn btn-link mt-2" onClick={() => router.push("/menu")}>
          ← Volver al menú
        </button>
      </aside>

      <section className="card md:col-span-2">
        {isEditing ? (
          <>
            <h3>{selected ? "Editar Cliente" : "Crear Cliente"}</h3>
            {selected && (
              <div className="mb-2">
                <label>ID:</label>
                <input className="input" type="text" value={selected.id} disabled />
              </div>
            )}

            <div className="mb-2">
              <label>Nombre*:</label>
              <input
                className="input"
                type="text"
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label>Apellido*:</label>
              <input
                className="input"
                type="text"
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label>DNI/CUIT:</label>
              <input
                className="input"
                type="text"
                name="dni"
                value={form.dni || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Teléfono:</label>
              <input
                className="input"
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Email:</label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Dirección:</label>
              <input
                className="input"
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Info Adicional:</label>
              <textarea
                className="input"
                name="additionalInfo"
                value={form.additionalInfo || ""}
                onChange={handleChange}
              />
            </div>

            <div className="mt-2">
              {!selected ? (
                <>
                  <button className="btn btn-primary" onClick={handleAdd}>
                    Crear Cliente
                  </button>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={handleUpdate}>
                    Guardar Cambios
                  </button>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-secondary ml-2" onClick={handleDelete}>
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <p>Seleccione un cliente o haga clic en “Agregar cliente” para comenzar.</p>
        )}

        {showLogs && (
          <div className="card-secondary mt-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <h4>Registro de actividad</h4>
            {logs.map((log, i) => (
              <div key={i} className="mb-1">
                <small>
                  {new Date(log.timestamp).toLocaleString("es-AR", {
                    timeZone: "America/Argentina/Cordoba",
                  })}
                </small>
                {" – "}
                {log.userName} {log.action}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
