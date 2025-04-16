// src/components/Menu.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Menu() {
  const { userData } = useAuth();
  const [userInfo, setUserInfo] = useState({
    displayName: "Usuario",
    uniqueCode: "SINCOD",
  });

  useEffect(() => {
    if (userData) {
      setUserInfo({
        displayName: userData.displayName || "Usuario",
        uniqueCode: userData.uniqueCode || "SINCOD",
      });
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-xl">
          ¡Hola, {userInfo.displayName}!<br />
          Tu código de usuario es: {userInfo.uniqueCode}
        </p>
        <button className="mt-2 text-blue-500 hover:underline">Cerrar sesión</button>
      </header>

      {/* Botones principales */}
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
        <Link href="/menu/mi-estudio">
          <a className="p-4 bg-white shadow rounded hover:bg-gray-100">Mi estudio jurídico</a>
        </Link>
      </nav>
    </div>
  );
}
