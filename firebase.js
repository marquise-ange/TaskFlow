// FIREBASE APP
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";


// FIRESTORE
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";



// FIREBASE CONFIGURATION
const firebaseConfig = {
apiKey: "process.env.GOOGLE_API_KEY",
authDomain: "taskflow-590c0.firebaseapp.com",
projectId: "taskflow-590c0",
storageBucket: "taskflow-590c0.firebasestorage.app",
messagingSenderId: "488787893008",
appId: "1:488787893008:web:742e9d088efb4f68916395"
        };



// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);


// INITIALIZE FIRESTORE
export const db = getFirestore(app);