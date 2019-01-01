const { decorate, injectable, inject } = require('inversify');
const TYPES = require('../../types');

class RequestSender {
  constructor(socketService) {
    this.socketService = socketService;
  }

  async get(req, res) {
    this.socketService.get(req)
      .then(response => res.json(response));
  }
}

decorate(injectable(), RequestSender);
decorate(inject(TYPES.SocketService), RequestSender, 0);

module.exports = RequestSender;
