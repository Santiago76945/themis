// src/lib/firebaseUser.ts

export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  uniqueCode: string;
  lawFirmCode?: string;
}

/**
 * Fetch user profile from the serverless function.
 * This function runs in the browser and does not import mongoose.
 */
export async function fetchUserProfileFromMongo(
  uid: string
): Promise<UserProfile | null> {
  const res = await fetch(
    `/.netlify/functions/getUserProfile?uid=${encodeURIComponent(uid)}`
  );
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(
      `Error fetching user profile: ${res.status} ${res.statusText}`
    );
  }
  const { profile } = await res.json();
  return profile;
}
