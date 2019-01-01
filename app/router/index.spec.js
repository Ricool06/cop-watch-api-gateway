require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../types');
const routerMaker = require('.');

const mockRouter = {
  use: jest.fn(),
};
jest.mock('express', () => ({
  Router: () => mockRouter,
}));

describe('router', () => {
  let container;
  let router;

  beforeAll(() => {
    container = new Container();

    const mockMiddleware1 = {};
    const mockMiddleware2 = {};
    container.bind(TYPES.Middleware).toConstantValue(mockMiddleware1);
    container.bind(TYPES.Middleware).toConstantValue(mockMiddleware2);
  });

  test('should use all GET middlewares', () => {
    container.bind(TYPES.Router).toDynamicValue(routerMaker);
    router = container.get(TYPES.Router);

    expect(router).toBe(mockRouter);

    const mockMiddlewares = container.getAll(TYPES.Middleware)
      .map(middleware => middleware.get);
    expect(router.get).toHaveBeenCalledWith(mockMiddlewares);
  });
});
