'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config; config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const db = require('./openHouseEventsDb/dbConnectionProvider');
const messageBus = shared.utils.messageBus;

logger.info({
  version: process.env.npm_package_version,
  env: config.get('NODE_ENV')
}, 'Starting server');

logger.info({
  hostname: config.get('RDS_HOSTNAME'),
  dbname: config.get('RDS_DB_NAME')
}, 'Connecting to DB');

function startMessageConsumers() {
  const consumer = require('./queueConsumer/messageConsumer');
  
  logger.info('Begin consuming messages from SQS queue');
  const appEventsConsumers = messageBus.consume.start(
    config.get('OHE_API_EVENTS_SQS_QUEUE_URL'), 
    consumer.handleMessage);

  process.on('exit', function (code) {
    appEventsConsumers.stop();
    process.exit(code);
  });

  // Ctrl-C exit
  process.on('SIGINT', function () {
    process.exit(0);
  });
}

function* bootstrap() {
  yield db.connect();
  startMessageConsumers();
  const server = require('./server/server'); // server should be required only after db connect finish
  return server.listen();
}

if (require.main === module) {
  co(bootstrap).catch(ex => {
    logger.error('failed to bootstrap application', ex.stack || ex);
    process.exit(-1);
  });
}

module.exports = {
  bootstrap
};
