import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyA2nz2TZp30YvufB8MKCGvqe-ZoUd3eBFo",
    authDomain: "mono-task34.firebaseapp.com",
    databaseURL: "https://mono-task34-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mono-task34",
    storageBucket: "mono-task34.appspot.com",
    messagingSenderId: "108321066186",
    appId: "1:108321066186:web:8f07133dfc11b2942b3833",
    measurementId: "G-8JD08ZCJZ9"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;