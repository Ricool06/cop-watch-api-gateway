require('reflect-metadata');
const { socket } = require('axon');
const { publishSocketPort, subscribeSocketPort } = require('../../../config').app;
const socketService = require('.');

jest.disableAutomock();

describe('SocketService', () => {
  test(`should have a get method that uses sockets to send GET requests,
  responding when it receives an event matching {requestid}:final-response`, async () => {
    const mockRequest = {
      id: 'someId',
      method: 'GET',
      url: 'something.com',
      query: {
        event: 'test:event',
        query: '{thing}',
      },
    };
    const mockResponse = {
      data: {
        thing: 'bob',
      },
    };
    const expectedTopic = `${mockRequest.id}:${mockRequest.query.event}`;

    const mockApiSubscriber = socket('sub');
    const mockApiPublisher = socket('pub');

    await new Promise((resolve) => {
      mockApiPublisher.on('connect', () => resolve());
      mockApiPublisher.connect(subscribeSocketPort);
    });
    await new Promise((resolve) => {
      mockApiSubscriber.on('message', (topic, req) => {
        expect(topic).toBe(expectedTopic);
        expect(req).toMatchObject(mockRequest);
        expect(req.id).toBeDefined();

        mockApiPublisher.send(`${req.id}:final-response`, mockResponse);
      });

      mockApiSubscriber.on('connect', () => resolve());
      mockApiSubscriber.connect(publishSocketPort);
    });

    const response = await socketService.get(mockRequest);

    expect(response).toEqual(mockResponse);
  });
});
