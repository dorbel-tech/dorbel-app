'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');
const swaggerDoc = require('./swagger/swagger');

const logger = shared.logger.getLogger(module);
const app = koa();

const port: number = shared.config.get('PORT');
const env = process.env.NODE_ENV;

// Catch all uncaught exceptions and write to log.
// TODO: Move to dorbel-shared.
process.on('uncaughtException', function(err) {
  logger.error(err);
  process.exit(1);
});

app.use(shared.middleware.errorHandler());
app.use(shared.middleware.requestLogger());
app.use(bodyParser());

app.use(function* handleSequelizeErrors(next) {
  try {
    yield next;
  }
  catch (ex) {
    if (ex.name === 'SequelizeValidationError') {
      this.body = ex.errors;
      this.status = 400;
    } else {
      throw ex;
    }
  }
});

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
  middleware: [ shared.middleware.swaggerModelValidator(), shared.middleware.optionalAuthenticate ],
  authenticate: shared.middleware.authenticate
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
