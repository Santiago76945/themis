// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebase"; // Importa la app ya inicializada

interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  uniqueCode?: string;
}

interface AuthContextProps {
  user: any;
  userData: UserData | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const auth = getAuth(app); // Se utiliza la instancia inicializada de Firebase

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserData({
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName || "",
          firstName: currentUser.displayName?.split(" ")[0] || "",
          uniqueCode: "ABC123", // Reemplaza por el valor real o consulta tu base de datos
        });
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
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
