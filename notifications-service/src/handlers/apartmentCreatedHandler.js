// Apartment created notifications handler.
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

function sendEmail(message, done) {
  // TODO: Get user email.
  // TODO: Add send transactional email implemetation.
  logger.debug('Sending email', message);
  done();
}

function sendSMS(message, done) {
  // TODO: Get user phone number.
  // TODO: Add send transactional SMS implemetation.
  logger.debug('Sending SMS', message);
  done();
}

module.export = {
  sendEmail,
  sendSMS
};
