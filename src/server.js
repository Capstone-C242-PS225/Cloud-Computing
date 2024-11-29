const Hapi = require('@hapi/hapi');
const userRoutes = require('./routes/routing');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });
  
  server.route(userRoutes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
