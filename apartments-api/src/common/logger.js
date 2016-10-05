'use strict';
const bunyan = require('bunyan');
const generalLogger = bunyan.createLogger({ name: 'general' });

function getLogger(callingModule) {
  let callingFileName;
  if (callingModule) callingFileName = callingModule.filename.split('/').pop();

  if (callingFileName) return bunyan.createLogger({ name: callingFileName });
  else return generalLogger;
}

module.exports = {
  getLogger
};
