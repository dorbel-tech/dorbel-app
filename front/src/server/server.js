'use strict';
import koa from 'koa';
import koaStatic from 'koa-static';
import compress from 'koa-compress';
import koa_ejs from 'koa-ejs';
import co from 'co';
import 'isomorphic-fetch'; // polyfill fetch for nodejs
import config from '~/config';
import shared from 'dorbel-shared';
import apiProxy from '~/server/apiProxy';
import { renderApp } from '~/app.server';

const logger = shared.logger.getLogger(module);

function* runServer() {
  const app = koa();
  const port = config.get('PORT');

  app.use(compress());
  app.use(shared.middleware.requestLogger());
  app.use(koaStatic(config.dir.public));

  yield apiProxy.loadProxy(app);

  koa_ejs(app, {
    root: __dirname,
    layout: false,
    viewExt: 'ejs'
  });

  app.use(renderApp);

  app.listen(port, () => {
    logger.info({ port, env: process.env.NODE_ENV }, '✅  Server is listening');
  });
}

if (require.main === module) co(runServer).catch(err => logger.error(err));
