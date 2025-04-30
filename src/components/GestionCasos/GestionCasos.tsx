// src/components/GestionCasos/GestionCasos.tsx

"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Cliente, Caso, CasoData, LogEntry } from "@/lib/api/types";
import { getMyLawFirm } from "@/lib/api";
import { Header } from "./Header";
import { Form } from "./Form";
import { Filters } from "./Filters";
import { CaseList } from "./CaseList";
import { LogList } from "./LogList";
import { Footer } from "./Footer";

export interface GestionCasosProps {
  clientes: Cliente[];
  casos: Caso[];
  onCrear: (clienteId: string, data: CasoData) => void;
  onModificar: (casoId: string, data: CasoData) => void;
  onEliminar: (casoId: string) => void;
  log: LogEntry[];
}

const GestionCasos: React.FC<GestionCasosProps> = ({
  clientes,
  casos,
  onCrear,
  onModificar,
  onEliminar,
  log,
}) => {
  const router = useRouter();
  const { userData } = useAuth();
  const userCode = userData?.uniqueCode ?? "";

  // Mostrar formulario y modo edición
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);

  // Valores del formulario
  const [clienteSel, setClienteSel] = useState("");
  const [formValues, setFormValues] = useState<CasoData>({});

  // Filtros de lista
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"" | "Alta" | "Media" | "Baja">("");
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (!userCode) return;
    getMyLawFirm(userCode).catch(console.error);
  }, [userCode]);

  const openEdit = (c: Caso) => {
    setSelectedCaso(c);
    setClienteSel(c.clienteId);
    setFormValues({ 
      clienteId: c.clienteId,
      rol: c.rol,
      caseType: c.caseType,
      honorariosEstimados: c.honorariosEstimados,
      referencia: c.referencia,
      numeroExpediente: c.numeroExpediente,
      caratula: c.caratula,
      tribunal: c.tribunal,
      estado: c.estado,
      proximaTarea: c.proximaTarea,
      fechaProximaTarea: c.fechaProximaTarea,
      prioridad: c.prioridad,
      observaciones: c.observaciones,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleClienteChange = (value: string) => {
    setClienteSel(value);
    setFormValues(prev => ({ ...prev, clienteId: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!clienteSel) return;

    const payload: CasoData = { ...formValues, clienteId: clienteSel };
    if (isEditing && selectedCaso) {
      onModificar(selectedCaso._id, payload);
    } else {
      onCrear(clienteSel, payload);
    }

    // Reset
    setFormValues({});
    setClienteSel("");
    setIsEditing(false);
    setSelectedCaso(null);
    setShowForm(false);
  };

  const casosFiltrados = casos.filter(c => {
    const cli = clientes.find(x => x.id === c.clienteId);
    const matchName = cli
      ? cli.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchPriority = !priorityFilter || c.prioridad === priorityFilter;
    return matchName && matchPriority;
  });

  return (
    <div className="container">
      <div className="card">
        <Header showForm={showForm} toggleForm={() => setShowForm(v => !v)} />

        {showForm && (
          <Form
            clientes={clientes}
            clienteSel={clienteSel}
            formValues={formValues}
            onClienteChange={handleClienteChange}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        )}

        <Filters
          searchTerm={searchTerm}
          priorityFilter={priorityFilter}
          onSearchChange={setSearchTerm}
          onPriorityChange={setPriorityFilter}
        />

        <CaseList
          casos={casosFiltrados}
          clientes={clientes}
          onEdit={openEdit}
          onEliminar={onEliminar}
        />

        {showLogs && <LogList log={log} />}

        <Footer
          onToggleLogs={() => setShowLogs(v => !v)}
          onBack={() => router.push("/menu")}
        />
      </div>
    </div>
  );
};

export default GestionCasos;
