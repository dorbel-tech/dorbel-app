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
import { getBuildOutputs } from './buildOutputs';

const logger = shared.logger.getLogger(module);

function* runServer() {
  const app = koa();
  const port = config.get('PORT');

  app.use(shared.middleware.errorHandler());
  app.use(shared.middleware.requestLogger());
  app.use(compress());
  getBuildOutputs(app);
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
