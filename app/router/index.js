const { decorate, injectable } = require('inversify');
const { Router } = require('express');
const TYPES = require('../types');

const routerMaker = (context) => {
  const router = Router();
  const middlewares = context.container
    .getAll(TYPES.Middleware)
    .map(middleware => middleware.get);
  router.get(middlewares);
  return router;
};

decorate(injectable(), routerMaker);

module.exports = routerMaker;
