const Joi = require('@hapi/joi');
const { signup, login, dataUser, updateProfileImage } = require('../controllers/authController');

const userRoutes = [
  // Registrasi
  {
    method: 'POST',
    path: '/register',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().label('Email'),
          username: Joi.string().min(3).required().label('Username'),
          password: Joi.string().min(6).required().label('Password'),
        }),
        failAction: async (request, h, err) => {
          console.error('Validation failed:', err); // Log error for debugging
          return h.response({
            status: 'fail',
            message: `Invalid input: ${err.message}`,
          }).code(400);
        },
      },
    },
    handler: signup,
  },

  // Login
  {
    method: 'POST',
    path: '/login',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().label('Email'),
          password: Joi.string().required().label('Password'),
        }),
        failAction: async (request, h, err) => {
          console.error('Validation failed:', err); // Log error for debugging
          return h.response({
            status: 'fail',
            message: `Invalid input: ${err.message}`,
          }).code(400);
        },
      },
    },
    handler: login,
  },

  // Ambil Data Pengguna
  {
    method: 'GET',
    path: '/users',
    handler: dataUser,
  },

  // Update Gambar Profil
  {
    method: 'PUT',
    path: '/profile/image',
    options: {
      validate: {
        payload: Joi.object({
          userId: Joi.string().guid({ version: 'uuidv4' }).required().label('User ID'),
          profile_img: Joi.string().uri().optional().pattern(/^https:\/\/storage\.googleapis\.com\//).label('Profile Image URL'),
        }),
        failAction: async (request, h, err) => {
          console.error('Validation failed:', err); // Log error for debugging
          return h.response({
            status: 'fail',
            message: `Invalid input: ${err.message}`,
          }).code(400);
        },
      },
    },
    handler: updateProfileImage,
  },
];

module.exports = userRoutes;