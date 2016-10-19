'use strict';
import shared from 'dorbel-shared';
import proxy from 'koa-proxy';

const logger = shared.logger.getLogger(module);
const apiPrefix = '/api';

function getApiDocs() {
  return ['APARTMENTS_API_URL']
    .map(urlKey => {
      const url = shared.config.get(urlKey);
      if (!url) {
        logger.error({ urlKey }, 'missing back end url key for proxy');
        return;
      }

      return fetch(url + '/swagger')
        .then(res => res.json())
        .then(res => ({
          url, basePath: res.basePath, paths: Object.keys(res.paths), title: res.info.title
        }));
    })
    .filter(res => !!res); // just the ones that turned into promises
}

function escapseSlashes(path) {
  return path.replace(/\//, '\\/');
}

function* loadProxy(app) {
  logger.info('loading proxy');
  const swaggerDocs = yield Promise.all(getApiDocs());

  swaggerDocs.forEach(doc => {
    // TODO : dynamic values will also need to be escaped (e.g. /apartments/:apartmentId)
    logger.debug({ url: doc.url, app: doc.title }, 'loading proxy for backend API');
    const paths = doc.paths.map(escapseSlashes).join('|');
    const pattern = `^\\${apiPrefix}\\${doc.basePath}(?:${paths})`;
    app.use(proxy({
      host:  doc.url,
      match: new RegExp(pattern),
      map: (path) => path.replace(apiPrefix, '')
    }));
  });
}

module.exports = {
  loadProxy
};

