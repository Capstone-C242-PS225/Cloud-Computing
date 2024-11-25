/* eslint-disable no-undef */
// src/server.js
const Hapi = require('@hapi/hapi');
const routes = require('./routes/books');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: { cors: { origin: ['*'] } },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();