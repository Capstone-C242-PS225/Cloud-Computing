const books = [];
  
  const routes = [
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return h.response({ message: 'Success' }).code(200);
      },
    },
    {
      method: 'GET',
      path: '/books',
      handler: (request, h) => {
        return books;
      },
    },
    {
      method: 'GET',
      path: '/books/{id}',
      handler: (request, h) => {
        const book = books.find(b => b.id === parseInt(request.params.id, 10));
        if (!book) {
          return h.response({ message: 'Book not found' }).code(404);
        }
        return book;
      },
    },
  ];
  
  module.exports = routes;
  