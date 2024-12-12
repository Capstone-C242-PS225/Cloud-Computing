/* eslint-disable no-undef */
// src/server.js
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("./routes/apiRoutes");

const init = async () => {
  const server = Hapi.server({
    host: '0.0.0.0',
    port: 5000,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  const VALID_API_KEY = process.env.KunciRumah;

  server.ext('onRequest', (request, h) => {
    console.log(`Incoming request: ${request.method.toUpperCase()} ${request.path}`);
    const apiKey = request.headers["x-api-key"];

    if (!apiKey || apiKey !== VALID_API_KEY) {
      return h.response({ error: "Invalid API Key" }).code(403).takeover();
    }

    return h.continue;
  });

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      console.error('Error occurred:', response.output.payload);
    }
    return h.continue;
  });

  // Mulai server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
