// src/components/LoginForm.tsx

"use client";

import { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onGuestAccess: (guestPassword: string) => void;
}

export default function LoginForm({ onLogin, onGuestAccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      onGuestAccess(guestPassword);
    } else {
      onLogin(username, password);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">
        {isGuest ? "Acceso de Desarrollador" : "Iniciar Sesión"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isGuest ? (
          <input
            type="password"
            value={guestPassword}
            onChange={(e) => setGuestPassword(e.target.value)}
            placeholder="Contraseña de desarrollador"
            className="p-2 border rounded"
          />
        ) : (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario o Email"
              className="p-2 border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="p-2 border rounded"
            />
          </>
        )}
        <button
          type="submit"
          className="bg-blue-500 p-2 text-white rounded hover:bg-blue-600"
        >
          {isGuest ? "Acceder" : "Entrar"}
        </button>
      </form>
      <button
        onClick={() => setIsGuest((prev) => !prev)}
        className="mt-2 text-sm text-gray-600 hover:underline"
      >
        {isGuest ? "Acceder con cuenta normal" : "Acceso sin iniciar sesión"}
      </button>
    </div>
  );
}
