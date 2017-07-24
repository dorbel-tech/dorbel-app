'use strict';
const koa = require('koa');
const fleekRouter = require('fleek-router');
const bodyParser = require('koa-bodyparser');
const shared = require('dorbel-shared');
const swaggerDoc = require('./swagger/swagger');

const graphqlSchema = require('./graphql/schema');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const logger = shared.logger.getLogger(module);
const app = koa();

const port: number = process.env.PORT || 3000;
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

const graphqlHandler = graphqlKoa({ schema: graphqlSchema });
const graphiqlHandler = graphiqlKoa({ endpointURL: '/graphql' });

app.use(function* returnGraphql(next) {
  if (this.method === 'POST' && this.url.match(/^\/graphql/)) {
    yield graphqlHandler(this);
  } else if (this.method === 'GET' && this.url === '/graphiql') {
    yield graphiqlHandler(this);
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
