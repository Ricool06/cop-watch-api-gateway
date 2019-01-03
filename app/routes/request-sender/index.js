const TYPES = require('../../types');

const requestSenderMaker = (context) => {
  const binding = { socketService: context.container.get(TYPES.SocketService) };

  async function utilize(req, res) {
    const socketRequest = (({
      body, url, headers, method, query,
    }) => ({
      body, url, headers, method, query,
    }))(req);

    await this.socketService.request(req.headers['x-event-type'], socketRequest)
      .then(response => res.status(response.status).json(response.body));
  }
  return utilize.bind(binding);
};

module.exports = requestSenderMaker;
