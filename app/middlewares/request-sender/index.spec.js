require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../../types');
const RequestSender = require('.');
const SocketService = require('../../services/socket');

jest.mock('../../services/socket');

describe('RequestSender', () => {
  let container;

  beforeAll(() => {
    container = new Container();

    container.bind(TYPES.SocketService).to(SocketService);
    container.bind(TYPES.Middleware).to(RequestSender);
  });

  test('should have a utilize method that uses the SocketService to send requests', () => {
    const requestSender = container.get(TYPES.Middleware);
    const mockRequest = {
      method: 'GET',

    };

    requestSender.utilize(req, res, next);
  });
});
