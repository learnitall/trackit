import {createContext} from 'react';
import {initializeApp} from "firebase/app";
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAZkebUc3jK0VFIjF5ZDzrOc3Q85j24gOg',
  authDomain: 'trackit-606d0.firebaseapp.com',
  projectId: 'trackit-606d0',
  storageBucket: 'trackit-606d0.appspot.com',
  messagingSenderId: '669528637609',
  appId: '1:669528637609:web:d0dd1a423c565eb00069b8',
};
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
provider.addScope('https://www.googleapis.com/auth/calendar.events');
