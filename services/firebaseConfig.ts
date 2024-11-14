// services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWuItY3Tn7nYPOcbryDWWk6PM7D6cLUnM",
  authDomain: "inventory-dbc6c.firebaseapp.com",
  projectId: "inventory-dbc6c",
  storageBucket: "inventory-dbc6c.firebasestorage.app",
  messagingSenderId: "515684598172",
  appId: "1:515684598172:web:723469c9263f09f493c859",
  measurementId: "G-1JY5YS333T"
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth và Firestore từ app
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
