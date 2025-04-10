// src/app/login/page.tsx

"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    // Aquí se integraría la lógica con Firebase Auth o Supabase Auth.
    console.log("login normal con:", username, password);
    // Simulación: redirigir al menú una vez autentificado
    router.push("/menu");
  };

  const handleGuestAccess = async (guestPassword: string) => {
    // Validación simple contra una contraseña en la nube (puede venir desde una variable de entorno)
    if (guestPassword === process.env.NEXT_PUBLIC_GUEST_PASSWORD) {
      console.log("Acceso de desarrollador concedido");
      router.push("/menu");
    } else {
      alert("Contraseña incorrecta para acceso sin iniciar sesión.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm
        onLogin={handleLogin}
        onGuestAccess={handleGuestAccess}
      />
    </div>
  );
}
