const uuid = require('uuid');
const { socket } = require('axon');
const { publishSocketPort, subscribeSocketPort } = require('../../../config').app;

const publishSocket = socket('pub');
const subscribeSocket = socket('sub');
publishSocket.bind(publishSocketPort);
subscribeSocket.bind(subscribeSocketPort);

function request(eventType, data) {
  return new Promise((resolve) => {
    const requestId = uuid.v4();
    const outgoingTopic = `${requestId}:${eventType}`;
    const subscribedTopic = `${requestId}:final-response`;

    subscribeSocket.subscribe(subscribedTopic);
    subscribeSocket.on('message', (topic, response) => resolve(response));
    publishSocket.send(outgoingTopic, data);
  });
}

async function closeSockets() {
  await new Promise((resolve) => {
    publishSocket.once('close', () => resolve());
    publishSocket.close();
  });
  await new Promise((resolve) => {
    subscribeSocket.once('close', () => resolve());
    subscribeSocket.close();
  });
}

const socketService = {
  request,
  closeSockets,
};

module.exports = socketService;
