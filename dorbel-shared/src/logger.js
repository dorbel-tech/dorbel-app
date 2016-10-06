'use strict';
const bunyan = require('bunyan');
const config = require('./config');

const generalLogger = bunyan.createLogger({ name: 'general', level: config.get('LOG_LEVEL') });

function getLogger(callingModule) {
  let callingFileName;
  if (callingModule) callingFileName = callingModule.filename.split('/').pop();

  if (callingFileName) return bunyan.createLogger({ name: callingFileName, level: config.get('LOG_LEVEL') });
  else return generalLogger;
}

module.exports = {
  getLogger
};
