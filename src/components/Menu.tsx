// src/components/Menu.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFirebaseUserData } from "@/lib/firebaseUser";

export default function Menu() {
  const [userInfo, setUserInfo] = useState({
    displayName: "Usuario",
    uniqueCode: "SINCOD",
  });

  useEffect(() => {
    async function getUserData() {
      const data = await fetchFirebaseUserData();
      if (data && data.displayName) {
        // Si no tienes almacenado el uniqueCode en Firebase, 
        // se puede derivar (por ejemplo, tomando los últimos 6 dígitos del UID)
        const computedUniqueCode = data.uid.slice(-6).toUpperCase();
        setUserInfo({
          displayName: data.displayName,
          uniqueCode: computedUniqueCode,
        });
      }
    }
    getUserData();
  }, []);

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
        <Link href="/menu/mi-estudio">
          <a className="p-4 bg-white shadow rounded hover:bg-gray-100">Mi estudio jurídico</a>
        </Link>
      </nav>
    </div>
  );
}
