'use strict';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaConvert = require('koa-convert'); // TODO: after shared middleware are migrated to KOA2 format this can be removed.
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

const fleekCtx = require('fleek-context');
const fleekRouter = require('fleek-router');
const swaggerDoc = require('./swagger/swagger');

const graphqlSchema = require('./graphql/schema');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const app = new Koa();

const port: number = process.env.PORT || 3000;
const env = process.env.NODE_ENV;

app.use(koaConvert(shared.middleware.errorHandler()));
app.use(koaConvert(shared.middleware.requestLogger()));
app.use(bodyParser());
app.use(koaConvert(shared.middleware.auth.optionalAuthenticate));

// Fleek + Swagger

app.use(fleekCtx(swaggerDoc));
app.use(koaConvert(shared.middleware.swaggerModelValidator()));
app.use(fleekRouter.tag('authenticated', koaConvert(shared.middleware.auth.authenticate)));
app.use(fleekRouter.controllers(`${__dirname}/controllers`));

app.use(async function returnSwagger(ctx, next) {
  if (ctx.method === 'GET' && ctx.url === '/swagger') {
    ctx.body = swaggerDoc;
  } else {
    await next();
  }
});

// GraphQL

app.use(async function returnGraphql(ctx, next) {
  const context = { user: ctx.request.user };

  if (ctx.method === 'POST' && ctx.url.match(/^\/graphql/)) {
    await graphqlKoa({ schema: graphqlSchema, context })(ctx);
  } else if (ctx.method === 'GET' && ctx.url.match(/^\/graphiql/)) {
    await graphiqlKoa({ endpointURL: '/graphql' })(ctx);
  } else {
    await next();
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
