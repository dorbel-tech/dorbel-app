'use strict';
const koa = require('koa');
const serve = require('koa-static');
const compress = require('koa-compress');
const koa_ejs = require('koa-ejs');
require('isomorphic-fetch'); // polyfill fetch for nodejs
const config = require('../config');
const shared = require('dorbel-shared');
const apiProxy = require('./apiProxy');
const renderApp = require('../app.server').renderApp;
const getBuildOutputs = require('./buildOutputs').getBuildOutputs;

const logger = shared.logger.getLogger(module);
const STATIC_FILE_MAX_AGE_MS = 31536000 * 1000; // http://stackoverflow.com/questions/7071763/max-value-for-cache-control-header-in-http

function* runServer() {
  const app = koa();
  const port = process.env.PORT || 3001;

  app.use(shared.middleware.errorHandler());
  app.use(shared.middleware.requestLogger());
  app.use(compress());
  getBuildOutputs(app);
  app.use(serve(config.dir.public, { maxage: STATIC_FILE_MAX_AGE_MS }));
  app.use(shared.middleware.auth.parseAuthToken);
  yield apiProxy.loadProxy(app);

  koa_ejs(app, {
    root: __dirname,
    layout: false,
    viewExt: 'ejs'
  });

  app.use(renderApp);

  return new Promise((resolve, reject) => {
    let server = app.listen(port, function () {
      logger.info({ version: process.env.npm_package_version, env: process.env.NODE_ENV, port }, 'Server started');
      resolve(server);
    })
    .on('error', reject);
  });
}

if (require.main === module) {
  shared.utils.serverRunner.startCluster(runServer);
}

module.exports = {
  runServer
};
