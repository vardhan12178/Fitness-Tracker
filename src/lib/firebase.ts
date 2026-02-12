import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoSZaU83G3xXRSOn3j7fW_SOq3pql3wqI",
  authDomain: "fittrack-f15f5.firebaseapp.com",
  projectId: "fittrack-f15f5",
  storageBucket: "fittrack-f15f5.firebasestorage.app",
  messagingSenderId: "532861428472",
  appId: "1:532861428472:web:ca729b11975e610b02d10d",
  measurementId: "G-ZXQ68JN6KY"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
