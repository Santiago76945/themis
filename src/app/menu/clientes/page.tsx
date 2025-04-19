"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Cargamos ClientManager solo en cliente para evitar errores de hidratación
const ClientManager = dynamic(
  () => import("@/components/ClientManager"),
  { ssr: false }
);

export default function ClientesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen p-4">
      <ClientManager />
    </div>
  );
}
