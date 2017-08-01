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

// Fleek + Swagger

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

// GraphQL

app.use(shared.middleware.auth.optionalAuthenticate);
app.use(function* returnGraphql(next) {
  const context = { user: this.request.user };

  if (this.method === 'POST' && this.url.match(/^\/graphql/)) {
    yield graphqlKoa({ schema: graphqlSchema, context })(this);
  } else if (this.method === 'GET' && this.url.match(/^\/graphiql/)) {
    yield graphiqlKoa({ endpointURL: '/graphql' })(this);
  } else {
    yield next;
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
