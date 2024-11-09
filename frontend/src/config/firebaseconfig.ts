
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import {getAuth,GoogleAuthProvider} from 'firebase/auth'
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD4gXt3cNQZw8-AbVMELl2ULVlVhVXHzXk",
    authDomain: "login-4b38e.firebaseapp.com",
    projectId: "login-4b38e",
    storageBucket: "login-4b38e.appspot.com",
    messagingSenderId: "530095858964",
    appId: "1:530095858964:web:19cf02d1882e381fff8e01",
    measurementId: "G-M2EPQZX0ZP"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth= getAuth(app)
  export const provider=new GoogleAuthProvider()