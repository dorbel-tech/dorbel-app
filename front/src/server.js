'use strict';
const koa = require('koa');
const config = require('./config');
const logger = require('dorbel-shared').logger.getLogger(module);

const app = koa();
const port = config.get('PORT');

app.listen(port, () => {
  logger.info({ port, env: process.env.NODE_ENV }, '✅  Server is listening');
});
