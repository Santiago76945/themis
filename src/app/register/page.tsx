// src/app/register/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/firebaseAuth";
import { generateUniqueCode } from "@/utils/generateCode";
import { getAuth, updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signUpWithEmail(email, password);
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // Generar el código de usuario único
        const uniqueCode = generateUniqueCode();

        // Actualizar el perfil del usuario (por ejemplo, displayName)
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        // Aquí deberías almacenar en tu base de datos adicional:
        // - firstName
        // - lastName
        // - uniqueCode
        // (podrías hacer una llamada a tu API o a tu función en MongoDB)
        console.log("Datos de registro almacenados:", {
          uid: user.uid,
          firstName,
          lastName,
          uniqueCode,
          email,
        });
      }
      router.push("/menu");
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un error al registrarte. Por favor intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl mb-4 font-bold text-center">Registrarse</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
