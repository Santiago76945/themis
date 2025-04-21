// src/context/AuthContext.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { fetchUserProfileFromMongo } from "@/lib/firebaseUser";

export interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  uniqueCode?: string;
  firstName?: string;
  lastName?: string;
  lawFirmCode?: string;   // <— Lo llenaremos aquí
}

export interface AuthContextProps {
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
  const extendedProfileRef = useRef<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 1) Recarga perfil desde Mongo
        const mongoProfile = await fetchUserProfileFromMongo(currentUser.uid);
        if (!mongoProfile) return;

        const baseData: UserData = {
          uid: mongoProfile.uid,
          email: mongoProfile.email,
          displayName: `${mongoProfile.firstName} ${mongoProfile.lastName}`,
          uniqueCode: mongoProfile.uniqueCode,
          firstName: mongoProfile.firstName,
          lastName: mongoProfile.lastName,
          // lawFirmCode: lo rellenamos seguidamente
        };

        // 2) Llamamos a getMyLawFirm para obtener código de estudio
        try {
          const res = await fetch(
            `/.netlify/functions/getMyLawFirm?userCode=${encodeURIComponent(
              mongoProfile.uniqueCode
            )}`
          );
          if (res.ok) {
            const { firm } = await res.json();
            baseData.lawFirmCode = firm.code;
          } else {
            console.warn("No se encontró estudio para:", mongoProfile.uniqueCode);
          }
        } catch (err) {
          console.error("Error al obtener estudio:", err);
        }

        setUserData(baseData);
        extendedProfileRef.current = baseData;
      } else {
        // usuario salió
        setUserData(null);
        extendedProfileRef.current = null;
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
