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
  apiKey: "AIzaSyCnbRZ_iZPXSyAP_g-aQft0Cp7GGaewJ28",
  authDomain: "wecare-b2c6a.firebaseapp.com",
  projectId: "wecare-b2c6a",
  storageBucket: "wecare-b2c6a.appspot.com",
  messagingSenderId: "52371940980",
  appId: "1:52371940980:web:846422c4938f3be227d321",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
