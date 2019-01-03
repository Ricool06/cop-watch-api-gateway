const { Given, When, Then } = require('cucumber');
const { socket } = require('axon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiUuid = require('chai-uuid');
const { publishSocketPort, subscribeSocketPort, httpEndpoint } = require('../../config').app;

chai.use(chaiHttp);
chai.use(chaiUuid);
const { expect } = chai;

Given('another service that is listening for {string} events is connected to the gateway', async function (expectedEventType) {
  this.mockPublisher = socket('pub');
  await new Promise((resolve) => {
    this.mockPublisher.on('connect', resolve);
    this.mockPublisher.connect(subscribeSocketPort);
  });
  this.mockSubscriber = socket('sub');
  await new Promise((resolve) => {
    this.mockSubscriber.on('connect', resolve);
    this.mockSubscriber.connect(publishSocketPort);
  });

  this.mockSubscriber.on('message', (event, eventData) => {
    const splitEvent = event.split(':');
    const requestId = splitEvent[0];
    const eventType = splitEvent[1];
    expect(requestId).to.be.uuid('v4');
    expect(eventType).to.equal(expectedEventType);
    this.receivedRequest = eventData;
    this.mockPublisher.send(`${requestId}:final-response`, this.goodResponse);
  });
});

When('I make a {string} GET request to this API', function (eventType, done) {
  this.requester
    .get(httpEndpoint)
    .set('X-Event-Type', eventType)
    .query({ query: '{goodData}' })
    .end((err, res) => {
      this.responseAndError = { err, res };
      done();
    });
});

When('I make a {string} POST request to this API', function (eventType, done) {
  this.requester
    .post(httpEndpoint)
    .set('X-Event-Type', eventType)
    .send({ query: '{goodData}' })
    .end((err, res) => {
      this.responseAndError = { err, res };
      done();
    });
});

Then('the connected service should receive a good GET request', function () {
  expect(this.receivedRequest.query).to.deep.equal(this.goodQuery);
  expect(this.receivedRequest.headers).to.have.property('x-event-type');
});

Then('the connected service should receive a good POST request', function () {
  expect(this.receivedRequest.body).to.deep.equal(this.goodQuery);
  expect(this.receivedRequest.headers).to.have.property('x-event-type');
});

Then('I should receive a good response', function () {
  const { err, res } = this.responseAndError;
  expect(err).to.be.null;
  expect(res).to.have.status(200);
  expect(res).to.be.json;
  // expect(res.body).to.equal(this.goodResponse.body);
});
