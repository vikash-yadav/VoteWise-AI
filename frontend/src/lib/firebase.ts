import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBh4H6EUuhUWxKzUQitjKYZli17v8OlbFg",
  authDomain: "vikash-codelab-foundation.firebaseapp.com",
  projectId: "vikash-codelab-foundation",
  storageBucket: "vikash-codelab-foundation.firebasestorage.app",
  messagingSenderId: "568919631440",
  appId: "1:568919631440:web:ee9266b389b365e3b31355"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
