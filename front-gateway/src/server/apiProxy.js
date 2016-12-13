'use strict';
import shared from 'dorbel-shared';
import proxy from 'koa-proxy';

const logger = shared.logger.getLogger(module);

const apisConfig = [{
  url: 'APARTMENTS_API_URL',
  prefix: 'apartments'
}, {
  url: 'OHE_API_URL',
  prefix: 'ohe'
}];

function* loadProxy(app) {
  logger.info('loading proxy');

  apisConfig.forEach(apiConfig => {
    logger.debug(apiConfig, 'loading proxy for backend API');
    const pattern = new RegExp(`^\/api\/${apiConfig.prefix}`);
    app.use(proxy({
      host: shared.config.get(apiConfig.url),
      match: pattern,
      map: (path) => path.replace(pattern, '')
    }));
  });
}

module.exports = {
  loadProxy
};
