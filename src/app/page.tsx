// src/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario logueado → lo llevamos al menú principal
        router.replace("/menu");
      } else {
        // Usuario NO logueado → lo llevamos al login
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null; // mientras decide adónde ir, no muestra nada
}
