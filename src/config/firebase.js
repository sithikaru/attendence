// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq80jJAQmyx2Jyzn1Noh880Qrx5uv2N4s",
  authDomain: "attendence-zijja.firebaseapp.com",
  projectId: "attendence-zijja",
  storageBucket: "attendence-zijja.appspot.com",
  messagingSenderId: "321266866589",
  appId: "1:321266866589:web:6d0f3ac61e55a447f33774"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth =getAuth(app);