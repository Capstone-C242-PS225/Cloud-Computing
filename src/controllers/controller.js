// here is the controller
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Untuk membuat ID unik
const db = []; // Simulasi database (gunakan database nyata dalam produksi)

// Fungsi Registrasi
const registerUser = async (request, h) => {
  const { email, username, password } = request.payload;

  // Validasi inputan
  if (!email || !username || !password) {
    return h.response({ message: 'Semua data harus diisi' }).code(400);
  }

  // Cek email terdaftar
  const isExist = db.some(user => user.email === email);
  if (isExist) {
    return h.response({ message: 'Email sudah terdaftar' }).code(409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Database
  const newUser = {
    id: uuidv4(),
    email,
    username,
    password: hashedPassword,
    created_at: new Date(),
  };
  db.push(newUser);

  return h.response({ message: 'Registrasi berhasil', userId: newUser.id }).code(201);
};

// Fungsi Login
const loginUser = async (request, h) => {
  const { email, password } = request.payload;

  // Validasi
  if (!email || !password) {
    return h.response({ message: 'Email dan password harus diisi' }).code(400);
  }

  // Email
  const user = db.find(user => user.email === email);
  if (!user) {
    return h.response({ message: 'Email tidak ditemukan' }).code(404);
  }

  // Password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return h.response({ message: 'Password salah' }).code(401);
  }

  return h.response({ message: 'Login berhasil', userId: user.id }).code(200);
};

module.exports = { registerUser, loginUser };
