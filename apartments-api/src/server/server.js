'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');

const logger = shared.logger.getLogger(module);
const app = koa();

const port: number = shared.config.get('PORT');
const env = process.env.NODE_ENV;

app.use(shared.middleware.requestLogger());
app.use(bodyParser());

fleekRouter(app, {
  swagger: './swagger.json',
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
