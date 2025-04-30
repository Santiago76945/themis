// src/components/GestionCasos/GestionCasos.tsx

"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Cliente, Caso, CasoData, LogEntry } from "@/lib/api/types";
import { getMyLawFirm } from "@/lib/api";
import { Header } from "./Header";
import { Form } from "./Form";
import { Filters } from "./Filters";
import { CaseList } from "./CaseList";
import { CaseDetailsModal } from "./CaseDetailsModal";
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

  // mostrar formulario / modal / edición
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // valores del formulario como parcial
  const [clienteSel, setClienteSel] = useState("");
  const [formValues, setFormValues] = useState<Partial<CasoData>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "" | "Alta" | "Media" | "Baja"
  >("");
  const [showLogs, setShowLogs] = useState(false);

  // carga lawFirmCode si necesita
  useEffect(() => {
    if (!userCode) return;
    getMyLawFirm(userCode).catch(console.error);
  }, [userCode]);

  const openNew = () => {
    setSelectedCaso(null);
    setFormValues({});
    setClienteSel("");
    setIsEditing(false);
    setShowForm(true);
    setShowDetails(false);
    setShowLogs(false);
  };

  // abre formulario en modo edición
  const openEdit = (c: Caso) => {
    setSelectedCaso(c);
    setClienteSel(c.clienteId);
    setFormValues({
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
    setShowDetails(false);
    setShowLogs(false);
  };

  const openDetails = (c: Caso) => {
    setSelectedCaso(c);
    setShowDetails(true);
    setShowForm(false);
    setShowLogs(false);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  const handleClienteChange = (value: string) => {
    setClienteSel(value);
    setFormValues((prev) => ({ ...prev, clienteId: value }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!clienteSel) return;

    const payload: CasoData = { ...(formValues as CasoData), clienteId: clienteSel };
    if (isEditing && selectedCaso) {
      onModificar(selectedCaso._id, payload);
    } else {
      onCrear(clienteSel, payload);
    }

    // reset
    setFormValues({});
    setClienteSel("");
    setIsEditing(false);
    setSelectedCaso(null);
    setShowForm(false);
  };

  const casosFiltrados = casos.filter((c) => {
    const cli = clientes.find((x) => x.id === c.clienteId);
    const matchName = cli
      ? (cli.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchPriority = !priorityFilter || c.prioridad === priorityFilter;
    return matchName && matchPriority;
  });

  return (
    <div className="container">
      <div className="card">
        <Header
          showForm={showForm}
          toggleForm={() => (showForm ? setShowForm(false) : openNew())}
        />

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
          onViewDetails={openDetails}
        />

        {showDetails && selectedCaso && (
          <CaseDetailsModal
            caso={selectedCaso}
            clientes={clientes}
            onClose={closeDetails}
          />
        )}

        {showLogs && <LogList log={log} />}

        <Footer
          onToggleLogs={() => {
            setShowLogs((v) => !v);
            setShowForm(false);
            setShowDetails(false);
          }}
          onBack={() => router.push("/menu")}
        />
      </div>
    </div>
  );
};

export default GestionCasos;
