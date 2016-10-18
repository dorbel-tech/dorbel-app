'use strict';
import shared from 'dorbel-shared';
import proxy from 'koa-proxy';

const logger = shared.logger.getLogger(module);
const apiPrefix = shared.config.get('API_PREFIX');

function getApiPaths(url) {
  return fetch(url + '/swagger')
    .then(res => res.json())
    .then(res => ({
      url, basePath: res.basePath, paths: Object.keys(res.paths)
    }));
}

function escapseSlashes(path) {
  return path.replace(/\//, '\\/');
}

function* loadProxy(app) {
  logger.info('loading proxy');
  const backendUrls = shared.config.get('BACKEND_URLS') || [];
  const swaggerDocs = yield Promise.all(backendUrls.map(getApiPaths));

  swaggerDocs.forEach(doc => {
    // TODO : dynamic values will also need to be escaped (e.g. /apartments/:apartmentId)
    logger.debug({ url: doc.url }, 'loading proxy for backend API');
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

