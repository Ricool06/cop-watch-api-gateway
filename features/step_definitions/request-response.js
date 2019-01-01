const {
  Given, When, Then,
} = require('cucumber');
const { socket } = require('axon');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

Given('another service that is listening for {string} events is connected to the gateway', async function (expectedEventType) {
  this.mockService = socket('sub');
  this.mockService.subscribe(`*:${expectedEventType}`);
  this.mockService.on('message', (eventType, eventData) => {
    expect(eventType).toBe(expectedEventType);
    this.receivedRequest = eventData;
  });
  await new Promise((resolve) => {
    this.mockService.on('connect', resolve);
    this.mockService.connect(this.requestSocketPort);
  });
});

When('I make a {string} request to this API', function (eventType, done) {
  this.goodRequest.event = eventType;
  this.requester
    .get(this.httpEndpoint)
    .query(this.goodRequest.query)
    .end((err, res) => {
      this.responseAndError = { err, res };
      done();
    });
});

Then('the connected service should receive a good request', function () {
  expect(this.receivedRequest).to.deep.equal(this.goodRequest);
});

Then('I should receive a good response', function () {
  const { err, res } = this.responseAndError;
  expect(err).to.be.null;
  expect(res).to.deep.equal(this.goodResponse);
});
