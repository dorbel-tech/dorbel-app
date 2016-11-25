'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config; config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const db = require('./apartmentsDb/dbConnectionProvider');

logger.info({ version: process.env.npm_package_version, env: config.get('NODE_ENV') }, 'Starting server');
logger.info({ hostname: config.get('RDS_HOSTNAME'), dbname: config.get('RDS_DB_NAME')}, 'Connecting to DB');

function* bootstrap() {
  yield db.connect();
  const server = require('./server/server'); // server should be required only after db connect finish
  return server.listen();
}

if (require.main === module) {
  co(bootstrap).catch(ex => {
    logger.error(ex.stack || ex, 'failed to bootstrap application');
    process.exit(-1);
  });
}

module.exports = {
  bootstrap
};
