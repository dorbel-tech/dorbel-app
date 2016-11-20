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
  middleware: [ shared.middleware.swaggerModelValidator() ],
  authenticate: function *(next) {
    // TODO : put in other file
    const user = JSON.parse(this.request.headers['x-user-profile']);
    if (user && user.id) {      
      this.request.user = user;
      yield next;
    } else {
      this.response.status = 401;
      this.response.body = 'Not Authorized';
    }
  }
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
