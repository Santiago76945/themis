// src/components/LoginForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } from "@/lib/firebaseAuth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Usuario con Google:", result.user);
      router.push("/menu");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const result = await signInWithApple();
      console.log("Usuario con Apple:", result.user);
      router.push("/menu");
    } catch (error) {
      console.error("Error al iniciar sesión con Apple:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmail(email, password);
      console.log("Usuario con Email:", result.user);
      router.push("/menu");
    } catch (error) {
      console.error("Error al iniciar sesión con Email:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      const result = await signUpWithEmail(email, password);
      console.log("Usuario registrado:", result.user);
      router.push("/menu");
    } catch (error) {
      console.error("Error al registrar usuario con Email:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 p-2 text-white rounded hover:bg-red-600"
        >
          Iniciar sesión con Google
        </button>
        <button
          onClick={handleAppleLogin}
          className="bg-black p-2 text-white rounded hover:bg-gray-800"
        >
          Iniciar sesión con Apple
        </button>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="p-2 border rounded"
          />
          <button
            onClick={handleEmailLogin}
            className="bg-blue-500 p-2 text-white rounded hover:bg-blue-600"
          >
            Iniciar sesión con Email
          </button>
          <button
            onClick={handleSignUp}
            className="bg-green-500 p-2 text-white rounded hover:bg-green-600"
          >
            Regístrate con Email
          </button>
        </div>
      </div>
    </div>
  );
}
