// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { setPersistence,getAuth, browserSessionPersistence} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmI14rQlrQp7-zgw81h-JFQZfrK3FKHhg",
  authDomain: "pantryapp-2fa7b.firebaseapp.com",
  projectId: "pantryapp-2fa7b",
  storageBucket: "pantryapp-2fa7b.appspot.com",
  messagingSenderId: "119400295778",
  appId: "1:119400295778:web:73505f0e9f151a9424503b",
  measurementId: "G-FXFFTQF5NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const auth = getAuth(app)
// const analytics = getAnalytics(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });


export {firestore, auth}