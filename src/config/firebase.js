// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC24er-LVcKUzLrhS82IaR1xQVO0Pz8cfQ",
  authDomain: "calendario-cierre.firebaseapp.com",
  projectId: "calendario-cierre",
  storageBucket: "calendario-cierre.firebasestorage.app",
  messagingSenderId: "337763936986",
  appId: "1:337763936986:web:2d3b631d12c9e5dc8593e3",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios exportados para usar en toda la app
export const db = getFirestore(app);
export { app };
export const storage = getStorage(app);

export default app;