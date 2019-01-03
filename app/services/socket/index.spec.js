require('reflect-metadata');
const uuid = require('uuid');
const { socket } = require('axon');
const { publishSocketPort, subscribeSocketPort } = require('../../../config').app;
const socketService = require('.');

jest.disableAutomock();

describe('SocketService', () => {
  let mockApiSubscriber;
  let mockApiPublisher;

  beforeAll(() => {
    mockApiSubscriber = socket('sub');
    mockApiPublisher = socket('pub');
  });

  test('should have a request method that uses sockets to send requests,'
+ 'responding when it receives an event matching {requestid}:final-response', async () => {
    const mockEventType = 'someEventType';
    const mockRequestId = 'fake-uuid';
    jest.spyOn(uuid, 'v4').mockReturnValue(mockRequestId);
    const mockRequest = {
      method: 'GET',
      url: 'something.com',
      query: {
        query: '{thing}',
      },
    };
    const mockResponse = {
      data: {
        thing: 'bob',
      },
    };

    await new Promise((resolve) => {
      mockApiPublisher.once('connect', () => resolve());
      mockApiPublisher.connect(subscribeSocketPort);
    });
    await new Promise((resolve) => {
      mockApiSubscriber.once('message', (topic, req) => {
        const splitTopic = topic.split(':');
        const requestId = splitTopic[0];
        const eventType = splitTopic[1];

        expect(eventType).toBe(mockEventType);
        expect(req).toMatchObject(mockRequest);
        expect(requestId).toBe(mockRequestId);

        mockApiPublisher.send(`${req.id}:final-response`, mockResponse);
      });

      mockApiSubscriber.once('connect', () => resolve());
      mockApiSubscriber.connect(publishSocketPort);
    });

    const response = await socketService.request(mockEventType, mockRequest);

    expect(response).toEqual(mockResponse);
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      mockApiPublisher.once('close', () => resolve());
      mockApiPublisher.close();
    });
    await new Promise((resolve) => {
      mockApiSubscriber.once('close', () => resolve());
      mockApiSubscriber.close();
    });
    await socketService.closeSockets();
  });
});
