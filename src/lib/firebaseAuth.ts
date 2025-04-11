// src/lib/firebaseAuth.ts

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } from "firebase/auth";
  import { app } from "./firebase";
  
  const auth = getAuth(app);
  
  /**
   * Inicia sesión con Google.
   */
  export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };
  
  /**
   * Inicia sesión con Apple.
   */
  export const signInWithApple = async () => {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    return await signInWithPopup(auth, provider);
  };
  
  /**
   * Inicia sesión con correo y contraseña.
   */
  export const signInWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  
  /**
   * Registra un usuario con correo y contraseña.
   */
  export const signUpWithEmail = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };
  