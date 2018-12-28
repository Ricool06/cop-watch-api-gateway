const { setWorldConstructor } = require('cucumber');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');

function World() {
  chai.use(chaiHttp);

  this.requester = chai.request(app);
  this.requestBoundPort = Number(process.env.REQUEST_BOUND_PORT);
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
