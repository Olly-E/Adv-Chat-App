import '../styles/globals.css'
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth,db} from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useEffect } from 'react';


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL
      }, {merge: true}) //the mere true is becasue the set is used for replacing and just incase there was an existin data it can just update without replacing
    }
  }, [])

  if (loading) return <Loading />
  if(!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
