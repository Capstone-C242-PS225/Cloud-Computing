const bcrypt = require('bcrypt');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const authController = {
  signup: async (request, h) => {
    const { email, username, password } = request.payload;

    if (!email || !username || !password) {
        return h.response({ message: 'Semua data harus diisi' }).code(400);
    }

    try {
      // Cek email di Firebase Authentication
        const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
        if (snapshot.exists()) {
            return h.response({ error: true, message: 'Email sudah terdaftar' }).code(400);
        }
        const userRecord = await admin.auth().createUser ({
            email: email,
            password: password,
            displayName: username,
        });

        // Simpan data ke Realtime Database
        const newUser_Ref = db.ref('users').push();
        await newUser_Ref.set({
            userId: newUser_Ref.key,
            username,
            email,
            password: await bcrypt.hash(password, 10),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        return h.response({ message: 'Registrasi berhasil', userId: newUser_Ref.key }).code(201);
    } catch (error) {
        console.error('Error during signup:', error);
        return h.response({ message: 'Terjadi kesalahan saat registrasi', error: error.message }).code(500);
    }
},

login: async (request, h) => {
  const { email, password } = request.payload;

  if (!email || !password) {
      return h.response({ message: 'Email dan password harus diisi' }).code(400);
  }

  try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
      const userData = snapshot.val();

      if (!userData) {
        // Sinkronisasi data Realtime Database jika ada di Firebase Authentication
          const newUser_Ref = db.ref('users').push();
          await newUser_Ref.set({
              userId: newUser_Ref.key,
              username: userRecord.displayName || 'Default Username',
              email: userRecord.email,
              password: await bcrypt.hash(password, 10),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
          });

          return h.response({ message: 'Data pengguna tidak ditemukan di database, tetapi telah diperbarui.' }).code(200);
      }

      const user = Object.values(userData)[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return h.response({ error: true, message: 'Email atau password salah' }).code(401);
      }

      return h.response({
          error: false,
          message: 'Login berhasil',
          loginResult: {
              userId: user.userId,
              username: user.username,
              email: user.email,
          },
      }).code(200);
  } catch (error) {
      console.error('Error during login:', error);
      return h.response({ error: true, message: 'Login gagal', details: error.message }).code(500);
  }
},

getUser: async (request, h) => {
  const email = request.payload['email'];
  console.log("Email:", email);

  if (!email) {
    return h.response({ message: 'Email harus diisi' }).code(400);
  }

  try {
    // Ambil data User
    const snapshot = await db.ref('users').orderByChild('email').equalTo(email).once('value');
    const userData = snapshot.val();

    if (!userData) {
      return h.response({ message: 'Pengguna tidak ditemukan' }).code(404);
    }
    const user = Object.values(userData)[0];

    return h.response({
      status: 'success',
      data: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    }).code(200);

  } catch (error) {
    console.error('Error fetching user data:', error);
    return h.response({ message: 'Terjadi kesalahan', error: error.message }).code(500);
  }
},
};

module.exports = authController;