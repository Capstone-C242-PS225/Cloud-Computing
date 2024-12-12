require("dotenv").config();
const admin = require('firebase-admin');
const serviceAccount = require('../JSON/INI-PENTING-BRO.json');

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.URL_DB,
});

const db = admin.database();

const saveUser  = async (username, email) => {
  try {
    const ref = db.ref('users');
    const newUserRef = ref.push();
    await newUserRef.set({
      username: username,
      email: email,
      createdAt: new Date().toISOString()
    });
    console.log('Data berhasil disimpan!');
  } catch (error) {r
    console.error('Error saving data:', error);
  }
};

module.exports = { db, saveUser  };