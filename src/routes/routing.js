const { registerUser, loginUser, dataUser, updateProfileImage } = require('../controllers/controller');

const userRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerUser,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginUser,
  },
  {
    method: 'GET',
    path: '/users',
    handler: dataUser,
  },
  {
    method: 'PUT',
    path: '/profile/image',
    handler: updateProfileImage,
  },
];

module.exports = userRoutes;
