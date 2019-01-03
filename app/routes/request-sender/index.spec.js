require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../../types');
const requestSenderMaker = require('.');

describe('requestSenderMaker', () => {
  let container;
  let mockSocketService;
  let mockResponse;
  let mockResponder;
  let mockNext;

  beforeAll(() => {
    container = new Container();
    mockResponder = {
      json: jest.fn(),
      status: jest.fn(() => mockResponder),
    };
    mockNext = jest.fn();

    mockResponse = {
      status: 200,
      body: {
        data: {
          thing: 'bob',
        },
      },
    };
    mockSocketService = {
      request: jest.fn(async () => mockResponse),
    };
    container.bind(TYPES.SocketService).toConstantValue(mockSocketService);

    container.bind(TYPES.Route).toDynamicValue(requestSenderMaker);
  });

  test('should be a function that uses the SocketService to send requests', async () => {
    const mockEventType = 'test:event';
    const mockRequest = {
      headers: {
        'x-event-type': mockEventType,
      },
      method: 'FAKE_METHOD',
      url: 'something.com',
      query: {
        query: '{thing}',
      },
    };

    const requestSender = container.get(TYPES.Route);
    await requestSender(mockRequest, mockResponder, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockSocketService.request).toHaveBeenCalledWith(mockEventType, mockRequest);
    expect(mockResponder.status).toHaveBeenCalledWith(mockResponse.status);
    expect(mockResponder.json).toHaveBeenCalledWith(mockResponse.body);
  });

  test('should only send body, url, headers, method, query to socket', async () => {
    const mockEventType = 'test:event';
    const mockRequest = {
      headers: {
        'x-event-type': mockEventType,
      },
      method: 'FAKE_METHOD',
      url: 'something.com',
      query: {
        query: '{thing}',
      },
      body: {
        someKey: 'someValue',
      },
      someOtherField: 'excluded',
      someOtherOtherField: 'excluded',
    };

    const requestSender = container.get(TYPES.Route);
    await requestSender(mockRequest, mockResponder, mockNext);

    expect(mockSocketService.request).toHaveBeenCalledWith(
      mockEventType,
      expect.not.objectContaining({ someOtherField: 'excluded', someOtherOtherField: 'excluded' }),
    );
  });
});
