require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('./app/types');
const Application = require('./app');
const routerMaker = require('./app/router');
const RequestSender = require('./app/middlewares/request-sender');
const socketService = require('./app/services/socket');

const container = new Container();
container.bind(TYPES.Application).to(Application);
container.bind(TYPES.Router).toDynamicValue(routerMaker);
container.bind(TYPES.Middleware).to(RequestSender);
container.bind(TYPES.SocketService).toConstantValue(socketService);

const application = container.get(TYPES.Application);
module.exports = application.start({

})
