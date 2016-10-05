'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');
const _ = require('lodash');

const logger = shared.logger.getLogger(module);
const app = koa();

const port: number = shared.config.get('PORT');
const env = process.env.NODE_ENV;

app.use(shared.middleware.requestLogger());
app.use(bodyParser());

// TODO : move to common
// Fleek is not validating the exact model so I am doing it here
const swaggerValidate = require('swagger-validate');
function* validateSwaggerSchema(next) {
  const parameters = _.get(this, ['fleek', 'routeConfig', 'details', 'parameters']);
  const bodyParam = _.find(parameters, { name: 'body', in: 'body' });
  let error;

  if (bodyParam && bodyParam.schema) {
    error = swaggerValidate.model(this.request.body, bodyParam.schema);
  }

  if (error) {
    this.status = 400;
    this.response.body = error;
  }
  else yield next;
}

fleekRouter(app, {
  swagger: './swagger.json',
  validate: true,
  middleware: [ validateSwaggerSchema ]
});



function listen() {
  return app.listen(port, function () {
    logger.info({ port, env }, 'listening');
  });
}

module.exports = {
  listen
};
