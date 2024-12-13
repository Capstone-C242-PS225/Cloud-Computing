const authController = require('../controllers/authController');
const { askPredict, reportLink, getMateri } = require("../controllers/controller");
  

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
          try {
            const welcomeMessage = 'Welcome to our FREE - Financial Resilience and Education for Ex-gamblers!';
            return h.response({ status: 'success', message: welcomeMessage }).code(200);
          } catch (error) {
            return h.response({ error: 'Failed to retrieve homepage.' }).code(500);
          }
      }
    },
    {
        method: 'POST',
        path: '/register',
        handler: authController.signup,
    },
    {
        method: 'POST',
        path: '/login',
        handler: authController.login,
    },
    {
        method: 'POST',
        path: '/getUser',
        handler: authController.getUser ,
    },
    {
        method: 'PUT',
        path: '/user/report',
        handler: reportLink,
    },
    {
        method: "POST", 
        path: "/askPredict", 
        handler: askPredict 
    },
    {
        method: "GET", 
        path: "/getMateri", 
        handler: getMateri
    },
];

module.exports = routes;