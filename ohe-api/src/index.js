'use strict';
const shared = require('dorbel-shared');
const config = shared.config; config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const db = require('./openHouseEventsDb/dbConnectionProvider');
const messageBus = shared.utils.messageBus;

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
}

function* bootstrap() {
  logger.info({
    hostname: config.get('RDS_HOSTNAME'),
    dbname: config.get('RDS_DB_NAME')
  }, 'Connecting to DB');
  yield db.connect();
  startMessageConsumers();
  const server = require('./server/server'); // server should be required only after db connect finish
  logger.info({
    version: process.env.npm_package_version,
    env: config.get('NODE_ENV')
  }, 'Starting server');
  return server.listen();
}

if (require.main === module) {
  shared.utils.serverRunner.startCluster(bootstrap);
}

module.exports = {
  bootstrap
};
