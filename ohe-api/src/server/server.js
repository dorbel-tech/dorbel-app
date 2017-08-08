'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');
const swaggerDoc = require('./swagger/swagger');

const logger = shared.logger.getLogger(module);
const app = koa();

const port = parseInt(process.env.PORT) || 3003;
const env = process.env.NODE_ENV;

app.use(shared.middleware.errorHandler());
app.use(shared.middleware.requestLogger());
app.use(bodyParser());

app.use(function* returnSwagger(next) {
  if (this.method === 'GET' && this.url === '/swagger') {
    this.body = swaggerDoc;
  } else {
    yield next;
  }
});

fleekRouter(app, {
  swagger: swaggerDoc,
  validate: true,
  middleware: [ shared.middleware.swaggerModelValidator(), shared.middleware.auth.optionalAuthenticate ],
  authenticate: shared.middleware.auth.authenticate
});

function listen() {
  return new Promise((resolve, reject) => {
    let server = app.listen(port, function () {
      logger.info({ port, env }, 'listening');
      resolve(server);
    })
    .on('error', reject);
  });
}

module.exports = {
  listen
};
