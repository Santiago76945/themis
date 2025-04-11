// src/app/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/menu");
    }
  }, [user, router]);

  const handleLogin = async (username: string, password: string) => {
    // Aquí integras la lógica (por ejemplo, utilizando Firebase Auth)
    console.log("login normal con:", username, password);
    // Simulación: redirigir al dashboard una vez autentificado
    router.push("/menu");
  };

  const handleGuestAccess = async (guestPassword: string) => {
    if (guestPassword === process.env.NEXT_PUBLIC_GUEST_PASSWORD) {
      console.log("Acceso de desarrollador concedido");
      router.push("/menu");
    } else {
      alert("Contraseña incorrecta para acceso sin iniciar sesión.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onLogin={handleLogin} onGuestAccess={handleGuestAccess} />
    </div>
  );
}
