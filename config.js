const config = {
  app: {
    publishSocketPort: Number(process.env.PUBLISH_SOCKET_PORT) || 9091,
    subscribeSocketPort: Number(process.env.SUBSCRIBE_SOCKET_PORT) || 9090,
    httpPort: Number(process.env.HTTP_PORT) || 8090,
    httpEndpoint: process.env.HTTP_ENDPOINT || '/graphql',
  },
};

module.exports = config;
