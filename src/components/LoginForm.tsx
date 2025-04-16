// src/components/LoginForm.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin: (identifier: string, password: string) => Promise<void>;
  onInternalKeyCreate: (
    internalKey: string,
    internalPassword: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
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
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [internalKey, setInternalKey] = useState("");
  const [internalPassword, setInternalPassword] = useState("");
  const [internalFirstName, setInternalFirstName] = useState("");
  const [internalLastName, setInternalLastName] = useState("");
  const [showInternalKeyForm, setShowInternalKeyForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Enviado formulario de login/registro, isRegister:", isRegister);
    if (isRegister) {
      if (!firstName || !lastName) {
        alert("Por favor ingresa tu nombre y apellido");
        return;
      }
      console.log("Llamando onRegister con datos:", { identifier, password, firstName, lastName });
      await onRegister(identifier, password, firstName, lastName);
    } else {
      console.log("Llamando onLogin con identifier:", identifier);
      await onLogin(identifier, password);
    }
  };

  const handleInternalKey = async () => {
    console.log("Botón de creación de usuario interno presionado.");
    if (!internalFirstName || !internalLastName) {
      alert("Por favor ingresa tu nombre y apellido");
      return;
    }
    if (!internalPassword) {
      alert("Por favor ingresa una contraseña para tu cuenta interna");
      return;
    }
    console.log("Llamando onInternalKeyCreate con los datos internos:", {
      internalKey,
      internalPassword,
      internalFirstName,
      internalLastName,
    });
    await onInternalKeyCreate(internalKey, internalPassword, internalFirstName, internalLastName);
  };

  return (
    <div className="card">
      <div className="logo-container">
        <Image src="/logo-gold.png" alt="Logo" width={200} height={200} className="logo" />
        <h1 className="logo-title">Themis</h1>
        <h2 className="logo-subtitle">Asistente Legal</h2>
      </div>
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
          type="text"
          placeholder="Correo electrónico o ID de usuario"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
      <div className="social-buttons">
        <button onClick={onGoogleLogin} className="btn btn-google">
          Iniciar sesión con Google
        </button>
        <button onClick={onAppleLogin} className="btn btn-apple">
          Iniciar sesión con Apple
        </button>
      </div>
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
              placeholder="Contraseña para cuenta interna"
              value={internalPassword}
              onChange={(e) => setInternalPassword(e.target.value)}
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
      <footer className="copyright">
        Software propiedad de Santiago Haspert Piaggio. Todos los derechos reservados.
      </footer>
    </div>
  );
}
