// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import dotenv from 'dotenv';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8NOCCrK-NCD8iX7gdNSl_ptt0gbOn-TU",
  authDomain: "meditrack-8dc73.firebaseapp.com",
  projectId: "meditrack-8dc73",
  storageBucket: "meditrack-8dc73.firebasestorage.app",
  messagingSenderId: "284008071967",
  appId: "1:284008071967:web:5c49e704eb942553f8a62a",
  measurementId: "G-K2E0RQJRJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

