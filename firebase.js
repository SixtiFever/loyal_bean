import firebase, { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCF4f9iVhHNGOpm2rWvhdAQmDyA2kxhwlQ",
    authDomain: "loyalbean-eb99f.firebaseapp.com",
    projectId: "loyalbean-eb99f",
    storageBucket: "loyalbean-eb99f.appspot.com",
    messagingSenderId: "3594849151",
    appId: "1:3594849151:web:83cdab4c040bbecd0f684a"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCiyW_xBNtFQA-qip1ghL-snObryNvdpJM",
// //   authDomain: "native-f7fbc.firebaseapp.com",
// //   projectId: "native-f7fbc",
// //   storageBucket: "native-f7fbc.appspot.com",
// //   messagingSenderId: "524720615158",
// //   appId: "1:524720615158:web:2c7a64b94a700d0c65c6d7"
// // };

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCF4f9iVhHNGOpm2rWvhdAQmDyA2kxhwlQ",
//     authDomain: "loyalbean-eb99f.firebaseapp.com",
//     projectId: "loyalbean-eb99f",
//     storageBucket: "loyalbean-eb99f.appspot.com",
//     messagingSenderId: "3594849151",
//     appId: "1:3594849151:web:83cdab4c040bbecd0f684a"
//   };

// // Initialize Firebase
// firebase
// firebaseConfig.initializeApp(firebaseConfig);