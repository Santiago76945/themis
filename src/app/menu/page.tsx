// src/app/menu/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function MenuPage() {
  const router = useRouter();
  const { user, userData, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Si existen tanto firstName como lastName, se combinan; de lo contrario se usa firstName o "Usuario" como fallback.
  const fullName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.firstName || "Usuario";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Hola, {fullName}
      </h1>
      <p className="mb-8">
        Tu código de usuario es: <strong>{userData?.uniqueCode}</strong>
      </p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
