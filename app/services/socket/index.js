const { socket } = require('axon');
const { publishSocketPort, subscribeSocketPort } = require('../../../config').app;

const publishSocket = socket('pub');
const subscribeSocket = socket('sub');
publishSocket.bind(publishSocketPort);
subscribeSocket.bind(subscribeSocketPort);

function get(req) {
  return new Promise((resolve) => {
    const outgoingTopic = `${req.id}:${req.query.event}`;
    const subscribedTopic = `${req.id}:final-response`;

    subscribeSocket.subscribe(subscribedTopic);
    subscribeSocket.on('message', (topic, response) => resolve(response));
    publishSocket.send(outgoingTopic, req);
  });
}

const socketService = {
  get,
};

module.exports = socketService;
