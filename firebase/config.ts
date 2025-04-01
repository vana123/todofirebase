// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASaSqkJbjfed9Yko5tdPvdmJ1A9fTh7V4",
  authDomain: "my-to-do-1c18f.firebaseapp.com",
  projectId: "my-to-do-1c18f",
  storageBucket: "my-to-do-1c18f.firebasestorage.app",
  messagingSenderId: "245854646741",
  appId: "1:245854646741:web:ef7c4580b53f3f3bd28d5c",
  measurementId: "G-THSNJMNS7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);