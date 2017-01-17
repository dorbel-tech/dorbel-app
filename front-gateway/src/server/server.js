'use strict';
import koa from 'koa';
import serve from 'koa-static';
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
  
  const segment = config.get('SEGMENT_IO_WRITE_KEY');
  const metaData = {
    title: 'dorbel - דירות להשכרה ללא תיווך שתשמחו לגור בהן',
    description: 'השכרת דירות ללא תיווך. כל הפרטים שחשוב לדעת על הדירות בכדי לחסוך ביקורים מיותרים. בחרו מועד והירשמו לביקור בדירות בלחיצת כפתור.',
    image: 'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/meta/homepage-middle-image.jpg'
  };

  // Adds locals param to use on server index.ejs view.
  app.use(function* (next) {    
    this.state.segment = segment;
    this.state.meta = metaData;
    yield next;
  });

  app.use(serve(config.dir.public));
  app.use(shared.utils.userManagement.parseAuthToken);
  yield apiProxy.loadProxy(app);

  koa_ejs(app, {
    root: __dirname,
    layout: false,
    viewExt: 'ejs'
  });

  app.use(renderApp);

  app.listen(port, () => {
    logger.info({ version: process.env.npm_package_version, env: config.get('NODE_ENV'), port }, 'Server started');
  });
}

if (require.main === module) {
  co(runServer).catch(err => logger.error(err));
}
