'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');
const swaggerDoc = require('./swagger.json');

const logger = shared.logger.getLogger(module);
const app = koa();

const port: number = shared.config.get('PORT');
const env = process.env.NODE_ENV;

app.use(shared.middleware.requestLogger());
app.use(bodyParser());

app.use(function* returnSwagger(next) {
  if (this.method === 'GET' && this.url === '/swagger') this.body = swaggerDoc;
  else yield next;
});

fleekRouter(app, {
  swagger: swaggerDoc,
  validate: true,
  middleware: [ shared.middleware.swaggerModelValidator() ]
});

function listen() {
  return app.listen(port, function () {
    logger.info({ port, env }, 'listening');
  });
}

module.exports = {
  listen
};
