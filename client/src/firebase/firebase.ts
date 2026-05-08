import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJPtpezUFExmRcam7zPHGAF7y7hAGRPzw",
  authDomain: "decision-helper-b4c30.firebaseapp.com",
  projectId: "decision-helper-b4c30",
  storageBucket: "decision-helper-b4c30.firebasestorage.app",
  messagingSenderId: "1091422109764",
  appId: "1:1091422109764:web:6b6246112613c85b54fc11",
  measurementId: "G-85DS0YJH2G",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();