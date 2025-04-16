// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/lib/firebase"; // App ya inicializada de Firebase
import { fetchUserProfileFromMongo } from "@/lib/firebaseUser";

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
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Intenta obtener el perfil extendido desde MongoDB
        const mongoProfile = await fetchUserProfileFromMongo(currentUser.uid);
        if (mongoProfile) {
          setUserData({
            uid: mongoProfile.uid,
            email: mongoProfile.email,
            displayName: currentUser.displayName || `${mongoProfile.firstName} ${mongoProfile.lastName}`,
            firstName: mongoProfile.firstName,
            uniqueCode: mongoProfile.uniqueCode,
          });
        } else {
          // Fallback a la información básica de Firebase
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
            firstName: currentUser.displayName?.split(" ")[0] || "",
            uniqueCode: currentUser.uid.slice(-6).toUpperCase(),
          });
        }
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
