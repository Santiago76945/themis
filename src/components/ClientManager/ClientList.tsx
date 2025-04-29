// src/components/ClientManager/ClientList.tsx

import React, { useState } from "react";
import type { Cliente } from "@/lib/api/types";

interface ClientListProps {
  clients: Cliente[];
  selectedClient: Cliente | null;
  onSelect: (client: Cliente) => void;
  onAddClick: () => void;
}

export default function ClientList({ clients, selectedClient, onSelect, onAddClick }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <aside className="card">
      <h2>Clientes</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o razón social"
        className="input mb-2"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <button className="btn btn-link mb-2" onClick={onAddClick}>
        + Agregar cliente
      </button>

      <ul className="overflow-auto" style={{ maxHeight: '400px' }}>
        {filtered.map(c => (
          <li
            key={c.id}
            className={`cursor-pointer p-2 ${selectedClient?.id === c.id ? 'bg-gray-200' : ''}`}
            onClick={() => onSelect(c)}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}