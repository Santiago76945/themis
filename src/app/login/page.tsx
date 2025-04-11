// src/app/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { signInWithApple, signInWithGoogle, signUpWithEmail } from "@/lib/firebaseAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/menu");
    }
  }, [user, router]);

  const handleLogin = async (email: string, password: string) => {
    // Lógica para login tradicional (correo y contraseña)
    console.log("Login normal con:", email, password);
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

  const handleAppleLogin = async () => {
    try {
      await signInWithApple();
      router.push("/menu"); // Redirige tras un inicio exitoso
    } catch (error) {
      console.error("Error al iniciar sesión con Apple:", error);
      alert("Ocurrió un error al iniciar sesión con Apple");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/menu");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Ocurrió un error al iniciar sesión con Google");
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await signUpWithEmail(email, password);
      router.push("/menu");
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Ocurrió un error al registrarse");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm
        onLogin={handleLogin}
        onGuestAccess={handleGuestAccess}
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
