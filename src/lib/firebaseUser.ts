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

export async function fetchUserProfileFromMongo(uid: string) {
  try {
    const response = await fetch(`/.netlify/functions/getUserProfile?uid=${uid}`);
    if (response.ok) {
      const data = await response.json();
      return data.profile;
    } else {
      console.error("Error fetching profile from MongoDB:", await response.text());
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile from MongoDB:", error);
    return null;
  }
}
