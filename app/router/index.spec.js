require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../types');
const routerMaker = require('.');

const mockRouter = {
  use: jest.fn(),
  all: jest.fn(),
};
jest.mock('express', () => ({
  Router: () => mockRouter,
}));

describe('router', () => {
  let container;
  let router;
  let mockMiddleware1;
  let mockMiddleware2;
  let mockRoute1;
  let mockRoute2;

  beforeAll(() => {
    container = new Container();

    mockMiddleware1 = jest.fn();
    mockMiddleware2 = jest.fn();
    mockRoute1 = jest.fn();
    mockRoute2 = jest.fn();
    container.bind(TYPES.Middleware).toConstantValue(mockMiddleware1);
    container.bind(TYPES.Middleware).toConstantValue(mockMiddleware2);
    container.bind(TYPES.Route).toConstantValue(mockRoute1);
    container.bind(TYPES.Route).toConstantValue(mockRoute2);
  });

  test('should use all middlewares', () => {
    container.bind(TYPES.Router).toDynamicValue(routerMaker);
    router = container.get(TYPES.Router);

    expect(router).toBe(mockRouter);

    const mockMiddlewares = container.getAll(TYPES.Middleware);
    expect(router.use).toHaveBeenCalledWith('/', mockMiddlewares);
  });

  test('should use all routes', () => {
    router = container.get(TYPES.Router);

    expect(router).toBe(mockRouter);

    const mockRoutes = container.getAll(TYPES.Route);
    expect(router.all).toHaveBeenCalledWith('/', mockRoutes);
  });
});
