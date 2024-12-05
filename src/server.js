const Hapi = require('@hapi/hapi');
const userRoutes = require('./routes/apiRoutes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Authorization', 'Content-Type'],
      },
    },
  });

  server.route(userRoutes);

  server.ext('onRequest', (request, h) => {
    console.log(`Incoming request: ${request.method.toUpperCase()} ${request.path}`);
    return h.continue;
  });

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      console.error('Error occurred:', response.output.payload);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

init();