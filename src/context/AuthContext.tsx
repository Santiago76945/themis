// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { fetchUserProfileFromMongo } from "@/lib/firebaseUser";

interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  uniqueCode?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextProps {
  user: User | null;
  userData: UserData | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const auth = getAuth(app);

  // Este ref nos permite saber si ya se obtuvo la información extendida de Mongo.
  const extendedProfileRef = useRef<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("AuthContext - onAuthStateChanged:", currentUser);
      setUser(currentUser);
      if (currentUser) {
        // Recargar para obtener datos actualizados
        await currentUser.reload();
        console.log("AuthContext - Usuario después de reload:", currentUser);
        // Si aún no se obtuvo la información extendida, hacemos la consulta a MongoDB.
        if (!extendedProfileRef.current) {
          const mongoProfile = await fetchUserProfileFromMongo(currentUser.uid);
          if (mongoProfile && mongoProfile.firstName && mongoProfile.lastName) {
            const fullName = `${mongoProfile.firstName} ${mongoProfile.lastName}`;
            console.log("AuthContext - Perfil Mongo encontrado:", mongoProfile);
            const newData: UserData = {
              uid: mongoProfile.uid,
              email: mongoProfile.email,
              displayName: fullName, // Se asigna el nombre completo
              uniqueCode: mongoProfile.uniqueCode,
              firstName: mongoProfile.firstName,
              lastName: mongoProfile.lastName,
            };
            setUserData(newData);
            extendedProfileRef.current = newData;
          } else {
            console.log("AuthContext - Perfil en Mongo no encontrado o incompleto; usando datos de Firebase.");
            const newData: UserData = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              uniqueCode: currentUser.uid.slice(-6).toUpperCase(),
            };
            setUserData(newData);
            extendedProfileRef.current = newData;
          }
        } else {
          console.log("AuthContext - Usando info extendida previamente obtenida:", extendedProfileRef.current);
        }
      } else {
        console.log("AuthContext - No hay usuario autenticado");
        setUserData(null);
        extendedProfileRef.current = null;
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Observar cambios en userData para depuración
  useEffect(() => {
    console.log("AuthContext - userData actual:", userData);
  }, [userData]);

  const logout = async () => {
    console.log("AuthContext - Realizando logout");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
