const { decorate, injectable } = require('inversify');
const { Router } = require('express');
const TYPES = require('../types');

const routerMaker = (context) => {
  const router = Router();

  const middlewares = context.container.getAll(TYPES.Middleware);
  router.use('/', middlewares);

  const routes = context.container.getAll(TYPES.Route);
  router.all('/', routes);
  return router;
};

decorate(injectable(), routerMaker);

module.exports = routerMaker;
