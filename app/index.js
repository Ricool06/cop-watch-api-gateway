const { decorate, injectable, inject } = require('inversify');
const express = require('express');
const TYPES = require('./types');

class Application {
  constructor(router) {
    this.router = router;
  }

  start(port, endpoint) {
    const app = express();

    app.use(endpoint, this.router);
    app.listen(port, () => console.log('Server starting on %d', port));

    return app;
  }
}

decorate(injectable(), Application);
decorate(inject(TYPES.Router), Application, 0);

module.exports = Application;
