import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAMbcKbMMAvASsqgrTBWDLgsHpNS_EV4BI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "curriculum-4accf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "curriculum-4accf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "curriculum-4accf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "706348410038",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:706348410038:web:ba65b73b1778b82fafb217",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ERTFC8RLNR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);