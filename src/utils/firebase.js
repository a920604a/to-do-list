// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ✅ 設定持久化登入：保留登入狀態在 localStorage
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Firebase 已設定為 localStorage 持久化登入");
    })
    .catch((error) => {
        console.error("設定持久化登入失敗：", error);
    });



const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };