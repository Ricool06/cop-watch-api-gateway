require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('./app/types');
const Application = require('./app');

const container = new Container();
container.bind(TYPES.Application).to(Application);

const application = container.get(TYPES.Application);
module.exports = application.start({

})
