'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config; 
const path = require('path'); config.setConfigFileFolder(path.join(__dirname, '/config')); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const dispatcher = require('./sender/dispatcher');
const notificationScheduler = require('./scheduler/notificationScheduler');
const notificationSender = require('./sender/notificationSender');
const notificationRepository = require('./notificationDb/notificationRepository');
const dbConnectionProvider = require('./notificationDb/dbConnectionProvider');
const messageBus = shared.utils.messageBus;

logger.info({
  version: process.env.npm_package_version,
  env: config.get('NODE_ENV')
}, 'Starting server');

const messageConsumers = [
  { name: 'email', queueKey: 'NOTIFICATIONS_EMAIL_SQS_QUEUE_URL', 
    handler: dispatcher.handleMessage.bind(dispatcher, 'email') },
  { name: 'sms', queueKey: 'NOTIFICATIONS_SMS_SQS_QUEUE_URL', 
    handler: dispatcher.handleMessage.bind(dispatcher, 'sms') },
  { name: 'app-events', queueKey: 'NOTIFICATIONS_APP_EVENTS_SQS_QUEUE_URL', 
    handler: notificationScheduler.handleMessage },
];

function startMessageConsumers() {
  const consumers = messageConsumers.map(consumer => {
    logger.info({ queueName: consumer.name }, 'Begin consuming messages from SQS queue');
    return messageBus.consume.start(config.get(consumer.queueKey), consumer.handler);
  });

  notificationRepository.startPolling(notificationSender.handleNotificationEvent, 1000 * 10); 

  process.on('exit', function (code) {
    logger.info('Stopping consuming messages from notifications SQS queues.');
    consumers.forEach(consumer => consumer.stop());
    notificationRepository.stopPolling();
    process.exit(code);
  });

  // Ctrl-C exit
  process.on('SIGINT', function () {
    process.exit(0);
  });
}

function* bootstrap() {
  yield dbConnectionProvider.connect();
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
