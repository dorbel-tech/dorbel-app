'use strict';
import koa from 'koa';
import serve from 'koa-static';
import compress from 'koa-compress';
import koa_ejs from 'koa-ejs';
import 'isomorphic-fetch'; // polyfill fetch for nodejs
import config from '~/config';
import shared from 'dorbel-shared';
import apiProxy from '~/server/apiProxy';
import { renderApp } from '~/app.server';

const logger = shared.logger.getLogger(module);

function* runServer() {
  const app = koa();
  const port = config.get('PORT');

  // Catch all uncaught exceptions and write to log.
  // TODO: Move to dorbel-shared.
  process.on('uncaughtException', function(err) {
    logger.error(err);
    process.exit(1);
  });

  app.use(shared.middleware.errorHandler());
  app.use(shared.middleware.requestLogger());
  app.use(compress());

  // Used for development only
  if (config.get('HOT_RELOAD_SERVER_PORT')) {
    const buildHost = 'http://localhost:' + config.get('HOT_RELOAD_SERVER_PORT');

    app.use(function* (next) {
      this.state = this.state || {};
      this.state.buildHost = buildHost;
      yield next;
    });

    app.use(require('koa-proxy')({
      host: buildHost,
      match: /^\/build\//,
    }));
  }

  app.use(serve(config.dir.public));
  app.use(shared.utils.userManagement.parseAuthToken);
  yield apiProxy.loadProxy(app);

  koa_ejs(app, {
    root: __dirname,
    layout: false,
    viewExt: 'ejs'
  });

  app.use(renderApp);

  return new Promise((resolve, reject) => {
    let server = app.listen(port, function () {
      logger.info({ version: process.env.npm_package_version, env: config.get('NODE_ENV'), port }, 'Server started');
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
