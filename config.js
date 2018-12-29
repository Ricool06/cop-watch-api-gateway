const config = {
  app: {
    requestSocketPort: Number(process.env.REQUEST_SOCKET_PORT) || 9090,
    httpEndpoint: process.env.HTTP_ENDPOINT || '/graphql',
  },
};

module.exports = config;
