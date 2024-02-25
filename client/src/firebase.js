// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "propfolio-19424.firebaseapp.com",
  projectId: "propfolio-19424",
  storageBucket: "propfolio-19424.appspot.com",
  messagingSenderId: "661645076835",
  appId: "1:661645076835:web:104b9f43a5ac279ef2cb56"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);