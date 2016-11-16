'use strict';
const co = require('co');
const shared = require('dorbel-shared');
const config = shared.config; config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else
const logger = shared.logger.getLogger(module);
const notificationsHandler = require('./handlers/notificationsHandler');
const messageBus = shared.utils.messageBus;

logger.info({ version: process.env.npm_package_version, env: config.get('NODE_ENV') }, 'Starting server');

function* bootstrap() {
  // Starting notifications SQS queue polling.
  logger.info('Begin consuming messages from notifications SQS queue.');
  let consumer = messageBus.consume.start(notificationsHandler.handleMessage);

  // Not sure it is going to work.
  process.on('exit', function(code) {
    logger.info('Stopping consuming messages from notifications SQS queue.'); 
    consumer.stop(); 
    process.exit(code);
  });

  // Ctrl-C exit
  process.on('SIGINT', function () {
    process.exit(0);
  });
  
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
