// src/app/menu/tasks/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";


// Carga dinámica para evitar problemas de SSR
const TaskManager = dynamic(
  () => import("@/components/TaskManager"),
  { ssr: false }
);

export default function TasksPage() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (user) setReady(true);
  }, [user]);

  if (!ready) return null;

  return (
    <div className="min-h-screen p-4">
      <TaskManager />
    </div>
  );
}
