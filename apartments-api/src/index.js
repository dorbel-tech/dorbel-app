'use strict';
require('@risingstack/trace'); // Application monitoring
const co = require('co');
const shared = require('dorbel-shared');
shared.config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else

const db = require('./apartmentDb/dbConnectionProvider');
const logger = shared.logger.getLogger(module);

logger.info({ version: process.env.npm_package_version, env: shared.config.get('NODE_ENV') }, 'Starting server');

function* bootstrap() {
  try {
    yield db.connect();
    const server = require('./server/server'); // server should be required only after db connect finish
    return server.listen();
  } catch (ex) {
    logger.error('failed to bootstrap application', ex);
    process.exit(-1);
  }
}

if (require.main === module) co(bootstrap);

module.exports = {
  bootstrap
};
