const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// You should set GOOGLE_APPLICATION_CREDENTIALS in .env pointing to your service account json file
// OR set FIREBASE_SERVICE_ACCOUNT as a JSON string
// For now, we'll try to initialize if credentials exist.

let firebaseInitialized = false;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    firebaseInitialized = true;
    console.log('Firebase initialized with Application Default Credentials');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('Firebase initialized with Service Account JSON');
  } else {
    console.warn('Firebase credentials not found. Notifications will not be sent.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

module.exports = { admin, firebaseInitialized };
