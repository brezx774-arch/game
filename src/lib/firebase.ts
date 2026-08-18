import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, browserPopupRedirectResolver, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: config.projectId,
  appId: config.appId,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});
export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
