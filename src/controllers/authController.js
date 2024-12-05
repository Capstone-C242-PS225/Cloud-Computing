const bcrypt = require('bcrypt');
//const admin = require('../config/firebase');
const isFirebaseEnabled = false;
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_PROFILE_IMG = 'https://storage.googleapis.com/free-bucket-profile/images/profile-default.png';

const authController = {
  signup: async (request, h) => {
    const { email, username, password } = request.payload;

    if (!email || !username || !password) {
      return h.response({ message: 'Semua data harus diisi' }).code(400);
    }

    try {
      let userRecord = null;

      if (isFirebaseEnabled) {
        // Firebase Authentication hanya dijalankan jika Firebase diaktifkan
        userRecord = await admin.auth().createUser({
          email,
          password,
        });
        // Pastikan userRecord ada sebelum melanjutkan
        if (!userRecord) {
          throw new Error('Firebase failed to create user');
        }
      } else {
        // Simulasi hasil pembuatan user tanpa Firebase
        userRecord = {
          uid: 'simulatedFirebaseId', // ID dummy
          email: email,
        };
        console.log('Firebase belum diaktifkan, menggunakan ID dummy');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Data User
      const userData = {
        id: uuidv4(),
        firebaseId: userRecord.uid,
        email: userRecord.email,
        username,
        password: hashedPassword,
        profile_img: DEFAULT_PROFILE_IMG,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Save ke Cloud SQL
      const connection = await pool.getConnection();
      const insertQuery = `
        INSERT INTO users (userId, firebaseId, email, username, password, profile_img, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertValues = [
        userData.id,
        userData.firebaseId,
        userData.email,
        userData.username,
        userData.password,
        userData.profile_img,
        userData.created_at,
        userData.updated_at,
      ];
      await connection.query(insertQuery, insertValues);
      connection.release();

      return h.response({ message: 'Registrasi berhasil', userId: userData.id }).code(201);
    } catch (error) {
      console.error('Error during signup:', error);
      return h.response({ message: 'Terjadi kesalahan', error: error.message }).code(500);
    }
  },

  // Login
  login: async (request, h) => {
    const { email, password } = request.payload;

    if (!email || !password) {
      return h.response({ message: 'Email dan password harus diisi' }).code(400);
    }

    try {
      const connection = await pool.getConnection();
      const query = 'SELECT * FROM users WHERE email = ?';
      const [results] = await connection.query(query, [email]);
      connection.release();

      if (results.length === 0) {
        return h.response({ message: 'Email tidak ditemukan' }).code(404);
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return h.response({ message: 'Password salah' }).code(401);
      }

      // Verifikasi Firebase Authentication
      const idToken = await admin.auth().createCustomToken(user.firebaseId);

      return h.response({ message: 'Login berhasil', token: idToken, userId: user.userId }).code(200);
    } catch (error) {
      console.error('Error during login:', error);
      return h.response({ message: 'Terjadi kesalahan', error: error.message }).code(500);
    }
  },

  // Data User
  dataUser: async (request, h) => {
    try {
      const connection = await pool.getConnection();
      const query = 'SELECT userId, email, username, profile_img, created_at, updated_at FROM users';
      const [results] = await connection.query(query);
      connection.release();

      return h.response({ users: results }).code(200);
    } catch (error) {
      console.error('Error fetching users:', error);
      return h.response({ message: 'Terjadi kesalahan', error: error.message }).code(500);
    }
  },

  // Update Profile User
  updateProfileImage: async (request, h) => {
    const { userId, profile_img } = request.payload;

    if (!userId) {
      return h.response({ message: 'UserId harus diisi' }).code(400);
    }

    try {
      const connection = await pool.getConnection();
      const updateQuery = `
        UPDATE users SET profile_img = ?, updated_at = ? WHERE userId = ?
      `;
      const updateValues = [profile_img || DEFAULT_PROFILE_IMG, new Date(), userId];
      const [result] = await connection.query(updateQuery, updateValues);
      connection.release();

      if (result.affectedRows === 0) {
        return h.response({ message: 'User tidak ditemukan' }).code(404);
      }

      return h.response({ message: 'Profile berhasil diperbarui', profile_img }).code(200);
    } catch (error) {
      console.error('Error updating profile image:', error);
      return h.response({ message: 'Terjadi kesalahan', error: error.message }).code(500);
    }
  },
};

module.exports = authController;