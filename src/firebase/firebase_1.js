// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { writeBatch } from "firebase/firestore";
import { signOut } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPx5VrHJnZO0JOtzzBJtvBNJ1LwaL7lQQ",
  authDomain: "clothing-87953.firebaseapp.com",
  projectId: "clothing-87953",
  storageBucket: "clothing-87953.firebasestorage.app",
  messagingSenderId: "628928415008",
  appId: "1:628928415008:web:8cfb6ece6c04ba7df5c345"
};

const firebase = initializeApp(firebaseConfig)
const provider = new GoogleAuthProvider();
const auth = getAuth(firebase);
const db = getFirestore(firebase);
const batch = writeBatch(db);
const signout  = async () => await signOut(auth) 

export {provider, auth ,db,signout,batch};