// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdsL3U3e7kkhFRz6xDC9MWuhzAGLq7cYs",
  authDomain: "ethbucharest-2024.firebaseapp.com",
  projectId: "ethbucharest-2024",
  storageBucket: "ethbucharest-2024.appspot.com",
  messagingSenderId: "297107025242",
  appId: "1:297107025242:web:c7ecf95c3379961ab39763"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);