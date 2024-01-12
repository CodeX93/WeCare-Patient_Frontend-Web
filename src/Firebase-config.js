// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVkHni-tGbb_Lgu_PhIQg896Hi4u9Lrc4",
  authDomain: "wecare-webpatient.firebaseapp.com",
  projectId: "wecare-webpatient",
  storageBucket: "wecare-webpatient.appspot.com",
  messagingSenderId: "167641995751",
  appId: "1:167641995751:web:d081c9ca84cbad3c530542",
  measurementId: "G-FCEQQWNNSW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
