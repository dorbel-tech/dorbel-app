'use strict';
const shared = require('dorbel-shared');

const { app, listen } = shared.utils.serverBootstrap.createApp({
  defaultPort: 3000,
  swaggerDocPath: `${__dirname}/swagger/swagger`,
  controllersPath: `${__dirname}/controllers`
});

// GraphQL

const graphqlSchema = require('./graphql/schema');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

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

module.exports = {
  listen
};
