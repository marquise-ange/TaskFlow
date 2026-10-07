// FIREBASE APP
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";


// FIRESTORE
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";



// FIREBASE CONFIGURATION



// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);


// INITIALIZE FIRESTORE
export const db = getFirestore(app);