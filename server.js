require('reflect-metadata');
const { Container } = require('inversify');
const bodyParser = require('body-parser');
const config = require('./config');
const TYPES = require('./app/types');
const Application = require('./app');
const routerMaker = require('./app/router');
const requestSenderMaker = require('./app/routes/request-sender');
const socketService = require('./app/services/socket');

const container = new Container();
container.bind(TYPES.Application).to(Application);
container.bind(TYPES.Router).toDynamicValue(routerMaker);
container.bind(TYPES.Route).toDynamicValue(requestSenderMaker);
container.bind(TYPES.Middleware).toConstantValue(bodyParser.json());
container.bind(TYPES.SocketService).toConstantValue(socketService);

const application = container.get(TYPES.Application);

module.exports = application.start(config.app.httpPort, config.app.httpEndpoint);
