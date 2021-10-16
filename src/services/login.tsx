import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/calendar.readonly");
provider.addScope("https://www.googleapis.com/auth/calendar.events");
