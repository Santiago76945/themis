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
  lawFirmCode?: string;      // <-- agregado
}

export interface AuthContextProps {
  user: User | null;
  userData: UserData | null;
  uniqueCode?: string;
  lawFirmCode?: string;      // <-- agregado
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData: null,
  uniqueCode: undefined,
  lawFirmCode: undefined,
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
        await currentUser.reload();
        if (!extendedProfileRef.current) {
          const mongoProfile = await fetchUserProfileFromMongo(currentUser.uid);
          let newData: UserData;

          if (mongoProfile?.firstName && mongoProfile?.lastName) {
            const fullName = `${mongoProfile.firstName} ${mongoProfile.lastName}`;
            newData = {
              uid: mongoProfile.uid,
              email: mongoProfile.email,
              displayName: fullName,
              uniqueCode: mongoProfile.uniqueCode,
              firstName: mongoProfile.firstName,
              lastName: mongoProfile.lastName,
              lawFirmCode: mongoProfile.lawFirmCode,  // <-- agregado
            };
          } else {
            newData = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              uniqueCode: currentUser.uid.slice(-6).toUpperCase(),
              // lawFirmCode queda undefined si no viene de Mongo
            };
          }

          setUserData(newData);
          extendedProfileRef.current = newData;
        }
      } else {
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
    <AuthContext.Provider
      value={{
        user,
        userData,
        uniqueCode: userData?.uniqueCode,
        lawFirmCode: userData?.lawFirmCode,  // <-- expuesto aquí
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
