// src/components/Menu.tsx

"use client";

import Link from "next/link";

export default function Menu() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>

      {/* Botones principales: se muestran siempre, incluso si aún no tienen funcionalidad */}
      <nav className="grid grid-cols-2 gap-4">
        <Link href="/menu">
          <a className="p-4 bg-white shadow rounded hover:bg-gray-100">Inicio</a>
        </Link>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Tablero
        </a>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Mis Casos
        </a>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Agenda
        </a>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Documentos
        </a>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Contactos
        </a>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Finanzas
        </a>
        <a className="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          Configuración
        </a>
        {/* Botón especial de Mi estudio jurídico */}
        <Link href="/menu/mi-estudio">
          <a className="p-4 bg-white shadow rounded hover:bg-gray-100">Mi estudio jurídico</a>
        </Link>
      </nav>
    </div>
  );
}
