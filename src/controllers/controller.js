const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const DEFAULT_PROFILE_IMG = 'https://example.com/images/default-profile.png';
const db = []; // Simulasi

// Fungsi Registrasi
const registerUser = async (request, h) => {
  const { email, username, password } = request.payload;

  if (!email || !username || !password) {
    return h.response({ message: 'Semua data harus diisi' }).code(400);
  }

  const isExist = db.some(user => user.email === email);
  if (isExist) {
    return h.response({ message: 'Email sudah terdaftar' }).code(409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    email,
    username,
    password: hashedPassword,
    profile_img: DEFAULT_PROFILE_IMG,
    created_at: new Date(),
    updated_at: new Date(),
  };

  db.push(newUser);

  return h.response({ message: 'Registrasi berhasil', userId: newUser.id }).code(201);
};

// Fungsi Login
const loginUser = async (request, h) => {
  const { email, password } = request.payload;

  if (!email || !password) {
    return h.response({ message: 'Email dan password harus diisi' }).code(400);
  }

  const user = db.find(user => user.email === email);
  if (!user) {
    return h.response({ message: 'Email tidak ditemukan' }).code(404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return h.response({ message: 'Password salah' }).code(401);
  }

  return h.response({ message: 'Login berhasil', userId: user.id }).code(200);
};

// Fungsi Data User
const dataUser = async (request, h) => {
  return h.response({ users: db }).code(200);
};

// Fungsi Update Profile Image
const updateProfileImage = async (request, h) => {
  const { userId, profile_img } = request.payload;

  if (!userId) {
    return h.response({ message: 'UserId harus diisi' }).code(400);
  }

  const user = db.find(user => user.id === userId);
  if (!user) {
    return h.response({ message: 'User tidak ditemukan' }).code(404);
  }

  if (profile_img) {
    user.profile_img = profile_img;
  }

  user.updated_at = new Date();

  return h.response({ message: 'Profile berhasil diperbarui', profile_img: user.profile_img }).code(200);
};

module.exports = { registerUser, loginUser, dataUser, updateProfileImage };
