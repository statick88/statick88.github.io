import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: "AIzaSyAMbcKbMMAvASsqgrTBWDLgsHpNS_EV4BI",
  authDomain: "curriculum-4accf.firebaseapp.com",
  projectId: "curriculum-4accf",
  storageBucket: "curriculum-4accf.firebasestorage.app",
  messagingSenderId: "706348410038",
  appId: "1:706348410038:web:ba65b73b1778b82fafb217",
  measurementId: "G-ERTFC8RLNR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);