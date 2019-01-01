require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../../types');
const RequestSender = require('.');

describe('RequestSender', () => {
  let container;

  beforeAll(() => {
    container = new Container();

    container.bind(TYPES.Middleware).to(RequestSender);
  });

  test('should have a get method that uses the SocketService to send GET requests', async () => {
    const mockResponse = {
      data: {
        thing: 'bob',
      },
    };
    const mockSocketService = {
      get: jest.fn(async () => mockResponse),
    };
    container.bind(TYPES.SocketService).toConstantValue(mockSocketService);

    const requestSender = container.get(TYPES.Middleware);

    const mockRequest = {
      method: 'GET',
      url: 'something.com',
      query: {
        event: 'test:event',
        query: '{thing}',
      },
    };
    const mockResponder = { json: jest.fn() };
    const mockNext = jest.fn();

    await requestSender.get(mockRequest, mockResponder, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockSocketService.get).toHaveBeenCalledWith(mockRequest);
    expect(mockResponder.json).toHaveBeenCalledWith(mockResponse);
  });
});
