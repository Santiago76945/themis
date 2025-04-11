// src/lib/firebaseUser.ts

import { getAuth } from "firebase/auth";

export async function fetchFirebaseUserData() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    // Recargamos la información para asegurar que esté actualizada
    await user.reload();
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
  return null;
}
