import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZxHghYeCeXgD6UculJpQVo1qFMx_fSFw",
  authDomain: "skillupplus2030-60203.firebaseapp.com",
  projectId: "skillupplus2030-60203",
  storageBucket: "skillupplus2030-60203.firebasestorage.app",
  messagingSenderId: "488276166160",
  appId: "1:488276166160:web:8f67313fdcc53083156c95"
};

// inicializa firebase
const app = initializeApp(firebaseConfig);

// exportar auth e firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
