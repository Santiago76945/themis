// src/app/menu/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Menu from "@/components/Menu";

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

  return <Menu userData={userData} onLogout={handleLogout} />;
}
