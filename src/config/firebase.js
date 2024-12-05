const admin = require('firebase-admin');
const serviceAccount = require('../JSON/serviceaccountkey.json'); // Sesuaikan dengan path file Anda

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'free-bucket-profile.appspot.com', // Ganti dengan bucket Anda
});

module.exports = admin;