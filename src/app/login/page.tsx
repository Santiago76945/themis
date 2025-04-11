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
      router.push("/menu");
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

  // Función de registro que recibe email, password, nombre y apellido
  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      // Registra el usuario usando Firebase Auth
      await signUpWithEmail(email, password);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Genera el código único de 6 dígitos
        const uniqueCode = generateUniqueCode();
        // Actualiza el perfil en Firebase Auth; aquí podemos concatenar nombre y apellido
        await updateProfile(currentUser, {
          displayName: `${firstName} ${lastName}`,
        });

        // Construye el objeto de usuario a guardar en la nube
        const userProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          firstName,
          lastName,
          uniqueCode,
          registrationMethod: "email",
        };

        // Envía la información a un endpoint para almacenar el perfil completo en la nube
        // Asegúrate de tener implementada la función en el backend (por ejemplo, en Netlify Functions)
        const response = await fetch("/.netlify/functions/createUserProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProfile),
        });

        if (!response.ok) {
          throw new Error("Error al guardar el perfil en la nube");
        }
      }
      router.push("/menu");
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Ocurrió un error al registrarse");
    }
  };

  // También se mantiene la función para la clave interna, si se utiliza
  const handleInternalKeyCreate = async (internalKey: string) => {
    if (internalKey === process.env.NEXT_PUBLIC_INTERNAL_KEY) {
      try {
        // Se generan credenciales automáticas
        const email = `internal_${Date.now()}@themis.com`;
        const password = Math.random().toString(36).slice(-8);
        await signUpWithEmail(email, password);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const uniqueCode = generateUniqueCode();
          await updateProfile(currentUser, {
            displayName: `Usuario Interno (${uniqueCode})`,
          });
          // En este caso, el usuario se crea sin nombre/apellido reales;
          // se recomienda que el método interno se use solo para desarrolladores o pruebas.
          const userProfile = {
            uid: currentUser.uid,
            email: currentUser.email,
            firstName: "Interno",
            lastName: "Usuario",
            uniqueCode,
            registrationMethod: "internal",
          };

          const response = await fetch("/.netlify/functions/createUserProfile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userProfile),
          });

          if (!response.ok) {
            throw new Error("Error al guardar el perfil interno en la nube");
          }
        }
        router.push("/menu");
      } catch (error) {
        console.error("Error al crear usuario con clave interna:", error);
        alert("Ocurrió un error al crear el usuario con clave interna");
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
