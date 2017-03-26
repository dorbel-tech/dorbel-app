'use strict';
require('dotenv');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const notificationSender = require('./sender/notificationSender');
const messageBus = shared.utils.messageBus;

logger.info({
  version: process.env.npm_package_version,
  env: process.env.NODE_ENV
}, 'Starting server');

function startMessageConsumers() {
  logger.info('Begin consuming messages from SQS queue');
  const appEventsConsumers = messageBus.consume.start(
    process.env.NOTIFICATIONS_APP_EVENTS_SQS_QUEUE_URL,
    notificationSender.handleMessage);

  process.on('exit', function (code) {
    appEventsConsumers.stop();
    process.exit(code);
  });
}

function* bootstrap() {
  startMessageConsumers(); // Starting notification messages consumers.
  const server = require('./server/server'); // server should be required only after db connect finish
  return server.listen();
}

if (require.main === module) {
  shared.utils.serverRunner.startCluster(bootstrap);
}

module.exports = {
  bootstrap
};
