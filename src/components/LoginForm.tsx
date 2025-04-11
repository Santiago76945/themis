// src/components/LoginForm.tsx

"use client";

import { useState } from "react";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onInternalKeyCreate: (internalKey: string, firstName: string, lastName: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onAppleLogin: () => Promise<void>;
  onRegister: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
}

export default function LoginForm({
  onLogin,
  onInternalKeyCreate,
  onGoogleLogin,
  onAppleLogin,
  onRegister,
}: LoginFormProps) {
  // Estados para login/registro tradicional
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Estados para el usuario de clave interna
  const [internalKey, setInternalKey] = useState("");
  const [internalFirstName, setInternalFirstName] = useState("");
  const [internalLastName, setInternalLastName] = useState("");
  const [showInternalKeyForm, setShowInternalKeyForm] = useState(false);

  // Estado para controlar el modo: login o registro
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegister) {
      if (!firstName || !lastName) {
        alert("Por favor ingresa tu nombre y apellido");
        return;
      }
      await onRegister(email, password, firstName, lastName);
    } else {
      await onLogin(email, password);
    }
  };

  const handleInternalKey = async () => {
    if (!internalFirstName || !internalLastName) {
      alert("Por favor ingresa tu nombre y apellido");
      return;
    }
    await onInternalKeyCreate(internalKey, internalFirstName, internalLastName);
  };

  return (
    <div className="card">
      {/* Logo y branding */}
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 className="logo-title">Themis</h1>
        <h2 className="logo-subtitle">Asistente Legal</h2>
      </div>
      
      {/* Formulario para login / registro */}
      <form onSubmit={handleSubmit} className="form">
        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
              required
            />
          </>
        )}
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

      {/* Sección para crear usuario a partir de clave interna */}
      <div>
        {showInternalKeyForm ? (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={internalFirstName}
              onChange={(e) => setInternalFirstName(e.target.value)}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={internalLastName}
              onChange={(e) => setInternalLastName(e.target.value)}
              className="input"
              required
            />
            <input
              type="password"
              placeholder="Clave interna"
              value={internalKey}
              onChange={(e) => setInternalKey(e.target.value)}
              className="input"
              required
            />
            <button onClick={handleInternalKey} className="btn btn-secondary">
              Crear usuario con clave interna
            </button>
          </>
        ) : (
          <button onClick={() => setShowInternalKeyForm(true)} className="btn btn-secondary">
            Crear usuario con clave interna
          </button>
        )}
      </div>
    </div>
  );
}
