'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const db = require('./apartmentsDb/dbConnectionProvider');

logger.info({ version: process.env.npm_package_version, env: process.env.NODE_ENV }, 'Starting server');
logger.info({ hostname: process.env.RDS_HOSTNAME, dbname: process.env.RDS_DB_NAME}, 'Connecting to DB');

function* bootstrap() {
  yield db.connect();
  const server = require('./server/server'); // server should be required only after db connect finish
  return server.listen();
}

if (require.main === module) {
  shared.utils.serverRunner.startCluster(bootstrap);
}

module.exports = {
  bootstrap
};
