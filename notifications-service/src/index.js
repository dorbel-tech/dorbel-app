'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config;
config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const emailNotificationsHandler = require('./handlers/emailNotificationsHandler');
const smsNotificationsHandler = require('./handlers/smsNotificationsHandler');
const messageBus = shared.utils.messageBus;

logger.info({
  version: process.env.npm_package_version,
  env: config.get('NODE_ENV')
}, 'Starting server');

function startMessageConsumers() {
  logger.info('Begin consuming messages from email notifications SQS queue.');
  const emailConsumer = messageBus.consume.start(
    config.get('NOTIFICATIONS_EMAIL_SQS_QUEUE_URL'),
    emailNotificationsHandler.handleMessage
  );

  logger.info('Begin consuming messages from SMS notifications SQS queue.');
  const smsConsumer = messageBus.consume.start(
    config.get('NOTIFICATIONS_SMS_SQS_QUEUE_URL'),
    smsNotificationsHandler.handleMessage
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
    logger.error('failed to bootstrap application', ex.stack || ex);
    process.exit(-1);
  });
}

module.exports = {
  bootstrap
};
