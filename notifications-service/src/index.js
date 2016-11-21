'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config; 
const path = require('path'); config.setConfigFileFolder(path.join(__dirname, '/config')); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const notificationsHandler = require('./transactional/notificationsHandler');
const messageBus = shared.utils.messageBus;

logger.info({
  version: process.env.npm_package_version,
  env: config.get('NODE_ENV')
}, 'Starting server');

function startMessageConsumers() {
  logger.info('Begin consuming messages from email notifications SQS queue.');
  const emailConsumer = messageBus.consume.start(
    config.get('NOTIFICATIONS_EMAIL_SQS_QUEUE_URL'),
    notificationsHandler.handleMessage.bind(notificationsHandler, 'Email')
  );

  logger.info('Begin consuming messages from SMS notifications SQS queue.');
  const smsConsumer = messageBus.consume.start(
    config.get('NOTIFICATIONS_SMS_SQS_QUEUE_URL'),
    notificationsHandler.handleMessage.bind(notificationsHandler, 'SMS')
  );

  // Not sure it is going to work.
  process.on('exit', function (code) {
    logger.info('Stopping consuming messages from notifications SQS queues.');
    emailConsumer.stop();
    smsConsumer.stop();
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
