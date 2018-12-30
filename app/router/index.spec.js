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

    const mockMiddleware1 = { utilize: jest.fn() };
    const mockMiddleware2 = { utilize: jest.fn() };
    container.bind(TYPES.Middleware).toConstantValue(mockMiddleware1);
    container.bind(TYPES.Middleware).toConstantValue(mockMiddleware2);
  });

  test('should use all middlewares', () => {
    container.bind(TYPES.Router).toDynamicValue(routerMaker);
    router = container.get(TYPES.Router);

    expect(router).toBe(mockRouter);

    const mockMiddlewares = container.getAll(TYPES.Middleware)
      .map(middleware => middleware.utilize);
    expect(router.use).toHaveBeenCalledWith(mockMiddlewares);
  });
});
