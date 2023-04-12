import firebaseAdmin from 'firebase-admin';
import serviceAccount from './matcha-42-bhamdi-mbouzaie-firebase-adminsdk-1klu6-dbe995a9d1.json' assert { type: 'json' };

let firebaseInitialized = false;

async function initializeFirebase() {
  if (!firebaseInitialized) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      storageBucket: 'matcha-42-bhamdi-mbouzaie.appspot.com',
    });

    firebaseInitialized = true;
  }

  const db = firebaseAdmin.firestore();
  const storage = firebaseAdmin.storage();

  return { db, storage };
}

export default initializeFirebase;
