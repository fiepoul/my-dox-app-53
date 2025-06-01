import { initializeApp } from 'firebase/app';
// @ts-ignore: getReactNativePersistence is not typed properly in Firebase SDK
import { GoogleAuthProvider, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDqZK0ygDLA9n4nQGeo3nI4-aQIo0z-zOE",
    authDomain: "cph-dox-app.firebaseapp.com",
    projectId: "cph-dox-app",
    storageBucket: "cph-dox-app.firebasestorage.app",
    messagingSenderId: "1000450722631",
    appId: "1:1000450722631:web:5128c794723bbc44475a62"
  };

const app = initializeApp(firebaseConfig);
//@ts-ignore
export const auth = initializeAuth(app)
// Google Auth provider for OAuth sign-in
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

