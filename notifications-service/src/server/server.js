'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');
const config = shared.config; 
const logger = shared.logger.getLogger(module);
const swaggerDoc = require('./swagger/swagger');
const app = koa();

const port: number = config.get('PORT');
const env = process.env.NODE_ENV;

// Catch all uncaught exceptions and write to log.
process.on('uncaughtException', function(err) {
  logger.error(err);
});

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
  middleware: [ shared.middleware.swaggerModelValidator() ]
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
