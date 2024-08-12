import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDnAWHg5EYyNksx2l-NE1I7t5UmYIh188M",
    authDomain: "good-blogger.firebaseapp.com",
    projectId: "good-blogger",
    storageBucket: "good-blogger.appspot.com",
    messagingSenderId: "515558101220",
    appId: "1:515558101220:web:08d427607a3aa8e5989cf1",
    measurementId: "G-XCRK23J69F"
  };
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);