// src/app/menu/clientes/page.tsx

"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ClientManager = dynamic(
  () => import("@/components/ClientManager"),
  { ssr: false } // <-- aquí desactivamos el SSR para ClientManager
);

export default function ClientesPage() {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  return (
    <div style={{ minHeight: "100vh", padding: "1rem" }}>
      <ClientManager />
    </div>
  );
}
