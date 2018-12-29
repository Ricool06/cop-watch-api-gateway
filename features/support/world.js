const { setWorldConstructor } = require('cucumber');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const config = require('../../config');

function World() {
  chai.use(chaiHttp);

  this.requester = chai.request(app);
  this.requestSocketPort = config.app.requestSocketPort;
  this.httpEndpoint = config.app.httpEndpoint;
  this.goodRequest = {
    query: `{
      goodData
    }`,
  };
  this.goodResponse = {
    status: 200,
    body: {
      data: {
        goodData: 'someGoodData',
      },
    },
  };
  this.responseAndError = null;
}

setWorldConstructor(World);
