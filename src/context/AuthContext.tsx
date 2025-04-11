// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// Aquí puedes importar funciones adicionales o inicializar la conexión a Firestore/MongoDB para obtener datos extra

interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  // Datos adicionales (p.ej., firstName, uniqueCode) que almacenes en tu base de datos
  firstName?: string;
  uniqueCode?: string;
}

interface AuthContextProps {
  user: any; // Objeto del usuario de Firebase
  userData: UserData | null; // Datos ampliados del usuario, si se recuperan de la base de datos
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
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Aquí puedes hacer una consulta a tu DB para obtener datos adicionales, 
        // por ejemplo, usando el uid para buscar en MongoDB o Firestore:
        // const data = await fetchUserData(currentUser.uid);
        // setUserData(data);
        // Para este ejemplo, asumiremos que displayName es el nombre y definimos un placeholder para uniqueCode:
        setUserData({
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName || "",
          firstName: currentUser.displayName?.split(" ")[0] || "",
          uniqueCode: "ABC123", // Esto debería venir de tu base de datos, o generarse una vez en el registro
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
