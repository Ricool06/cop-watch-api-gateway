
require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('./types');
const Application = require('.');

const mockExpressApp = {
  listen: jest.fn(),
  use: jest.fn(),
};
jest.mock('express', () => jest.fn(() => mockExpressApp));

const mockCors = { cors: 'yes please' };
jest.mock('cors', () => jest.fn(() => mockCors));

describe('Application', () => {
  let container;
  let application;
  let mockRouter;

  beforeAll(() => {
    container = new Container();

    mockRouter = jest.mock('./router');
    container.bind(TYPES.Router).toConstantValue(mockRouter);

    container.bind(TYPES.Application).to(Application);
    application = container.get(TYPES.Application);
  });

  test('should contain a Router', () => {
    expect(application.router).toBe(mockRouter);
  });

  test('should have start method that boots application', () => {
    const testPort = 1337;
    const testEndpoint = '/coolEndpoint';

    expect(application.start).toBeDefined();

    const actualExpressApp = application.start(testPort, testEndpoint);

    expect(actualExpressApp).toBe(mockExpressApp);
    expect(actualExpressApp.use).toHaveBeenNthCalledWith(1, mockCors);
    expect(actualExpressApp.use).toHaveBeenNthCalledWith(2, testEndpoint, mockRouter);
    expect(actualExpressApp.listen).toHaveBeenCalledWith(testPort, expect.any(Function));
  });
});
