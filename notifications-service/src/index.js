'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config; 
const path = require('path'); config.setConfigFileFolder(path.join(__dirname, '/config')); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const notificationSender = require('./sender/notificationSender');
const messageBus = shared.utils.messageBus;

logger.info({
  version: process.env.npm_package_version,
  env: config.get('NODE_ENV')
}, 'Starting server');

function startMessageConsumers() {
  logger.info('Begin consuming messages from SQS queue');
  const appEventsConsumers = messageBus.consume.start(
    config.get('NOTIFICATIONS_APP_EVENTS_SQS_QUEUE_URL'), 
    notificationSender.handleMessage);

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
  startMessageConsumers(); // Starting notification messages consumers.
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
