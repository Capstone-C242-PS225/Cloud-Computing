const {
    askPredict
  } = require("../controllers/controller");
  
  const routes = [
    { method: "POST", path: "/askPredict", handler: askPredict },
  ];
  
  module.exports = routes;