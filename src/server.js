/* eslint-disable no-undef */
// src/server.js
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("./routes/routing");

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT || 3000,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  const VALID_API_KEY = "apalahitusebuahkunci";

  server.ext("onRequest", (request, h) => {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey || apiKey !== VALID_API_KEY) {
      return h.response({ error: "Invalid API Key" }).code(403).takeover();
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
