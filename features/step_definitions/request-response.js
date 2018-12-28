const {
  Given, When, Then,
} = require('cucumber');
const axon = require('axon');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

Given('another service that will return good data is connected to the bound port of this API', function () {
  this.mockService = axon.socket('rep');
  this.mockService.connect(this.requestBoundPort);
  this.mockService.on('data', (message, reply) => {
    this.receivedRequest = message;
    reply();
  });
});

When('I make a good request to this API', function (done) {
  this.requester
    .post('/graphql')
    .send(this.goodRequest)
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
