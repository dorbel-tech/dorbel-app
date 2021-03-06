'use strict';
const shared = require('dorbel-shared');
const koaConvert = require('koa-convert'); // TODO: remove this after koa-proxy is converted to Koa2 (https://github.com/popomore/koa-proxy/issues/37)
const proxy = require('koa-proxy');

const logger = shared.logger.getLogger(module);

/* Definition of all grateway API urls and their prefixes in front-gateway proxy.
 * For example:
 *  apartments API oiginal route http://localhost:3000/v1/listings
 *  will be accessible from front-gateway as: http://localhost:3001/api/apartments/v1/listings
 */
const apisConfig = [{
  url: 'APARTMENTS_API_URL',
  prefix: 'apartments'
}];

function* loadProxy(app) {
  logger.info('loading proxy');

  apisConfig.forEach(apiConfig => {
    logger.info(apiConfig, 'loading proxy for backend API');
    const pattern = new RegExp(`^/api/${apiConfig.prefix}`);
    app.use(koaConvert(proxy({
      host: process.env[apiConfig.url],
      match: pattern,
      map: (path) => path.replace(pattern, '')
    })));
  });
}

module.exports = {
  loadProxy
};
