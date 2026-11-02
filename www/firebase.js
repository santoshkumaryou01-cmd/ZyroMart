import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "अपनी_FIREBASE_API_KEY",
  authDomain: "patnakart-6925b-5b441.firebaseapp.com",
  projectId: "patnakart-6925b-5b441",
  storageBucket: "patnakart-6925b-5b441.firebasestorage.app",
  messagingSenderId: "1053236001887",
  appId: "1:1053236001887:android:3bf6c81c6dd299715eefea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
