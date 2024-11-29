const { registerUser, loginUser } = require('../controllers/controller');

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
];

module.exports = userRoutes;
