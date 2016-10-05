'use strict';
const koa = require('koa');
const logger = require('./common/logger').getLogger(module);

const app = koa();
const port: number = process.env.PORT || 3000;
const env = process.env.NODE_ENV;

app.use(function *(){
  this.body = 'Hello World 5';
});

app.listen(port, function () {
  logger.info({ port, env }, 'listening');
});

