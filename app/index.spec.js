
require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('./types');
const Application = require('.');

const mockExpressApp = {
  listen: jest.fn(),
  use: jest.fn(),
};
jest.mock('express', () => jest.fn(
  () => mockExpressApp,
));

describe('Application', () => {
  let container;
  let application;

  beforeAll(() => {
    container = new Container();
    container.bind(TYPES.Application).to(Application);
  });

  test('should have start method that boots application', () => {
    const testPort = 1337;
    const testEndpoint = '/coolEndpoint';
    const mockRouter = {};
    container.bind(TYPES.Router).to(mockRouter);

    application = container.get(TYPES.Application);

    expect(application.start).toBeDefined();

    const actualExpressApp = application.start(testPort, testEndpoint);

    expect(actualExpressApp).toBe(mockExpressApp);
    expect(actualExpressApp.use).toHaveBeenCalledWith(mockRouter);
    expect(actualExpressApp.listen).toHaveBeenCalledWith(testPort, expect.any(Function));
  });
});
