// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
};

// Evitar múltiples inicializaciones
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let analytics: any = null;

// Solo se inicializa Analytics en el cliente, donde existe el objeto window
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) => {
      isSupported()
        .then((supported) => {
          if (supported) {
            analytics = getAnalytics(app);
          }
        })
        .catch((err) => {
          console.error("Firebase Analytics no es compatible:", err);
        });
    })
    .catch((err) => {
      console.error("Error al importar firebase/analytics:", err);
    });
}

export { app, analytics };
