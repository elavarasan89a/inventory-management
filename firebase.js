// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbnw04wIzBLSgbm-0OxLQ9Olh3PewU5iE",
  authDomain: "attil-inventory-management.firebaseapp.com",
  projectId: "attil-inventory-management",
  storageBucket: "attil-inventory-management.firebasestorage.app",
  messagingSenderId: "964951768156",
  appId: "1:964951768156:web:107549026e0c5437b97a99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db; 
