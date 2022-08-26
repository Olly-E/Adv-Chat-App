import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


const firebaseConfig = {
    apiKey: "AIzaSyASa1y_UspwYN2t2HvRnaBdcbxS2LrFkQg",
    authDomain: "whatsapp-2-9a3a8.firebaseapp.com",
    projectId: "whatsapp-2-9a3a8",
    storageBucket: "whatsapp-2-9a3a8.appspot.com",
    messagingSenderId: "400136835896",
    appId: "1:400136835896:web:7169f0eb557130ae2d67cd"
  };

const app = !firebase.apps.length
 ? firebase.initializeApp(firebaseConfig) 
 : firebase.app();

 const db = app.firestore();
 const auth = app.auth();
 const provider = new firebase.auth.GoogleAuthProvider();

 export {db, auth, provider};