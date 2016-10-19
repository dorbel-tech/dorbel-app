'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config;
shared.config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else

const db = require('./apartmentDb/dbConnectionProvider');
const logger = shared.logger.getLogger(module);

logger.info({ version: process.env.npm_package_version, env: config.get('NODE_ENV') }, 'Starting server');
logger.info({ hostname: config.get('RDS_HOSTNAME'), dbname: config.get('RDS_DB_NAME')}, 'Connecting to DB');  

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
