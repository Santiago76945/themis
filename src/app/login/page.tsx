// src/app/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { signInWithApple, signInWithGoogle, signUpWithEmail } from "@/lib/firebaseAuth";
import { updateProfile, getAuth } from "firebase/auth";
import { generateUniqueCode } from "@/utils/generateCode";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("Usuario autenticado, redireccionando a /menu.");
      router.replace("/menu");
    }
  }, [user, router]);

  const handleLogin = async (identifier: string, password: string) => {
    console.log("Inicio de proceso de login con identifier:", identifier);
    let loginEmail = identifier;
    if (!identifier.includes("@")) {
      if (!/^[A-Za-z0-9]{6}$/.test(identifier)) {
        alert("ID de usuario inválido. Debe ser 6 caracteres alfanuméricos.");
        return;
      }
      try {
        console.log("Consultando endpoint para obtener email por ID:", identifier);
        const response = await fetch(`/.netlify/functions/getUserEmailByUniqueCode?uniqueCode=${identifier}`);
        const data = await response.json();
        if (!response.ok) {
          console.error("Error al obtener email por ID:", data);
          alert(data.error || "Error al obtener el correo asociado a este ID.");
          return;
        }
        if (data.registrationMethod === "apple" || data.registrationMethod === "google") {
          alert("Los usuarios que se registraron con Apple o Google deben iniciar sesión con su correo electrónico.");
          return;
        }
        loginEmail = data.email;
        console.log("Email obtenido para login:", loginEmail);
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Error en fetch para obtener email por ID:", errMsg);
        alert("Error al obtener la información de inicio de sesión. Intenta de nuevo.");
        return;
      }
    }
    console.log("Procediendo con login con email:", loginEmail);
    router.push("/menu");
  };

  const handleGuestAccess = async (guestPassword: string) => {
    console.log("Intento de acceso como invitado.");
    if (guestPassword === process.env.NEXT_PUBLIC_GUEST_PASSWORD) {
      console.log("Acceso de desarrollador concedido");
      router.push("/menu");
    } else {
      alert("Contraseña incorrecta para acceso sin iniciar sesión.");
    }
  };

  const handleAppleLogin = async () => {
    console.log("Intento de inicio de sesión con Apple.");
    try {
      await signInWithApple();
      router.push("/menu");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error al iniciar sesión con Apple:", errMsg);
      alert("Ocurrió un error al iniciar sesión con Apple");
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Intento de inicio de sesión con Google.");
    try {
      await signInWithGoogle();
      router.push("/menu");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error al iniciar sesión con Google:", errMsg);
      alert("Ocurrió un error al iniciar sesión con Google");
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    console.log("Inicio de proceso de registro con email:", email);
    try {
      await signUpWithEmail(email, password);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uniqueCode = generateUniqueCode();
        console.log("Usuario registrado. Actualizando perfil en Firebase con displayName:", `${firstName} ${lastName}`);
        await updateProfile(currentUser, {
          displayName: `${firstName} ${lastName}`,
        });
        const userProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          firstName,
          lastName,
          uniqueCode,
          registrationMethod: "email",
        };
        console.log("Enviando perfil a la nube:", userProfile);
        const response = await fetch("/.netlify/functions/createUserProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProfile),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error al guardar el perfil en la nube:", errorText);
          throw new Error("Error al guardar el perfil en la nube");
        } else {
          console.log("Perfil creado exitosamente en la nube.");
        }
      } else {
        console.error("No se obtuvo el usuario actual tras registrarse.");
        throw new Error("Usuario no autenticado.");
      }
      console.log("Registro completado correctamente. Redireccionando a /menu.");
      router.push("/menu");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error al registrarse:", errMsg);
      alert("Ocurrió un error al registrarse: " + errMsg);
    }
  };

  const handleInternalKeyCreate = async (internalKey: string) => {
    console.log("Inicio de proceso de creación de usuario con clave interna.");
    if (internalKey === process.env.NEXT_PUBLIC_INTERNAL_KEY) {
      try {
        console.log("Clave interna correcta. Generando credenciales internas.");
        const email = `internal_${Date.now()}@themis.com`;
        const password = Math.random().toString(36).slice(-8);
        await signUpWithEmail(email, password);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const uniqueCode = generateUniqueCode();
          console.log("Usuario interno registrado. Actualizando perfil en Firebase con displayName:", `Usuario Interno (${uniqueCode})`);
          await updateProfile(currentUser, {
            displayName: `Usuario Interno (${uniqueCode})`,
          });
          const userProfile = {
            uid: currentUser.uid,
            email: currentUser.email,
            firstName: "Interno",
            lastName: "Usuario",
            uniqueCode,
            registrationMethod: "internal",
          };
          console.log("Enviando perfil interno a la nube:", userProfile);
          const response = await fetch("/.netlify/functions/createUserProfile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userProfile),
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en respuesta del servidor al guardar perfil interno:", errorText);
            throw new Error("Error al guardar el perfil interno en la nube");
          } else {
            console.log("Perfil interno guardado exitosamente en la nube.");
          }
        } else {
          console.error("No se obtuvo el usuario actual después del registro interno.");
          throw new Error("Usuario no autenticado.");
        }
        console.log("Usuario interno creado correctamente. Redireccionando a /menu.");
        router.push("/menu");
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Error en handleInternalKeyCreate:", errMsg);
        alert("Ocurrió un error al crear el usuario con clave interna: " + errMsg);
      }
    } else {
      alert("Clave interna incorrecta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm
        onLogin={handleLogin}
        onInternalKeyCreate={handleInternalKeyCreate}
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
