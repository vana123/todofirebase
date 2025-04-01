// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASaSqkJbjfed9Yko5tdPvdmJ1A9fTh7V4",
  authDomain: "my-to-do-1c18f.firebaseapp.com",
  projectId: "my-to-do-1c18f",
  storageBucket: "my-to-do-1c18f.firebasestorage.app",
  messagingSenderId: "245854646741",
  appId: "1:245854646741:web:ef7c4580b53f3f3bd28d5c",
  measurementId: "G-THSNJMNS7D"
};

const app = initializeApp(firebaseConfig);

// Ініціалізація Firebase Analytics лише якщо ми у браузері
if (typeof window !== "undefined") {
  import("firebase/analytics").then((analyticsModule) => {
    analyticsModule.isSupported().then((supported) => {
      if (supported) {
        analyticsModule.getAnalytics(app);
      }
    });
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);