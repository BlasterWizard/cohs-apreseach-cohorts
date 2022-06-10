// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9eYaho48CaPPBSsbGXWX-QQTuwePsdkc",
  authDomain: "apresearchcohorts.firebaseapp.com",
  projectId: "apresearchcohorts",
  storageBucket: "apresearchcohorts.appspot.com",
  messagingSenderId: "101895642636",
  appId: "1:101895642636:web:4e9edd08ffb66237cc5829",
  measurementId: "G-FL3EPQEHBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);