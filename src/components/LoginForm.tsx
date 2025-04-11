// src/components/LoginForm.tsx

"use client";
import { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onGuestAccess: (guestPassword: string) => Promise<void>;
}

export default function LoginForm({ onLogin, onGuestAccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [guestPassword, setGuestPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  const handleGuest = async () => {
    await onGuestAccess(guestPassword);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 my-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 my-2 w-full"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Iniciar Sesión
        </button>
      </form>

      <hr className="my-4" />

      <div>
        <input
          type="password"
          placeholder="Contraseña de invitado"
          value={guestPassword}
          onChange={(e) => setGuestPassword(e.target.value)}
          className="border p-2 my-2 w-full"
          required
        />
        <button
          onClick={handleGuest}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Acceso de invitado
        </button>
      </div>
    </div>
  );
}
