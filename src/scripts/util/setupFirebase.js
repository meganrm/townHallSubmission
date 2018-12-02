// FIREBASE METHODS
// Initialize Firebase

/* globals firebase */
console.log(
  process.env.FIREBASE_API_KEY, 
  process.env.FIREBASE_AUTH_DOMAIN,
  process.env.DATABASE_URL, 
  process.env.PROJECT_ID,
  process.env.MESSAGING_SENDER_ID,
  process.env.STORAGE_BUCKET
  )

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  storageBucket: process.env.STORAGE_BUCKET,
};

firebase.initializeApp(config);

const firebasedb = firebase.database();
const firebaseauth = firebase.auth();

export { firebase, firebasedb, firebaseauth };
