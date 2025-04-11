// src/components/LoginForm.tsx

"use client";

import { useState } from "react";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGuestAccess: (guestPassword: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onAppleLogin: () => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({
  onLogin,
  onGuestAccess,
  onGoogleLogin,
  onAppleLogin,
  onRegister,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegister) {
      await onRegister(email, password);
    } else {
      await onLogin(email, password);
    }
  };

  const handleGuest = async () => {
    await onGuestAccess(guestPassword);
  };

  return (
    <div className="card">
      {/* Formulario para login / registro */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="btn btn-primary">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </button>
      </form>

      {/* Botones para login con redes sociales */}
      <div>
        <button onClick={onGoogleLogin} className="btn btn-google">
          Iniciar sesión con Google
        </button>
        <button onClick={onAppleLogin} className="btn btn-apple">
          Iniciar sesión con Apple
        </button>
      </div>

      {/* Toggle para cambiar entre login y registro */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        {isRegister ? (
          <p>
            ¿Ya tienes una cuenta?{" "}
            <button onClick={() => setIsRegister(false)} className="text-link">
              Inicia sesión
            </button>
          </p>
        ) : (
          <p>
            ¿No tienes cuenta?{" "}
            <button onClick={() => setIsRegister(true)} className="text-link">
              Regístrate
            </button>
          </p>
        )}
      </div>

      <hr className="divider" />

      {/* Sección para acceso de invitado */}
      <div>
        <input
          type="password"
          placeholder="Contraseña de invitado"
          value={guestPassword}
          onChange={(e) => setGuestPassword(e.target.value)}
          className="input"
          required
        />
        <button onClick={handleGuest} className="btn btn-secondary">
          Acceso de invitado
        </button>
      </div>
    </div>
  );
}
