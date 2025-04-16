// src/lib/firebaseUser.ts

import { getAuth } from "firebase/auth";

export async function fetchFirebaseUserData() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    console.log("fetchFirebaseUserData - Usuario actual antes de reload:", user);
    // Recargamos la información para asegurar que esté actualizada
    await user.reload();
    console.log("fetchFirebaseUserData - Usuario actualizado:", user);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
  console.log("fetchFirebaseUserData - No hay usuario autenticado");
  return null;
}

export async function fetchUserProfileFromMongo(uid: string) {
  console.log("fetchUserProfileFromMongo - Iniciando fetch para uid:", uid);
  try {
    const response = await fetch(`/.netlify/functions/getUserProfile?uid=${uid}`);
    if (response.ok) {
      const data = await response.json();
      console.log("fetchUserProfileFromMongo - Perfil obtenido:", data.profile);
      return data.profile;
    } else {
      const errorText = await response.text();
      console.error("fetchUserProfileFromMongo - Error fetching profile from MongoDB:", errorText);
      return null;
    }
  } catch (error) {
    console.error("fetchUserProfileFromMongo - Error en fetch:", error);
    return null;
  }
}
