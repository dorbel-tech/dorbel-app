'use strict';
const config = require('./config');
const bunyan = require('bunyan');
const Logger = require('le_node');

function getLogger(callingModule) {
  let callingFileName;
  if (callingModule) {
    callingFileName = callingModule.filename.split('/').pop();
  }

  let loggerSettings = { 
    name: callingFileName, 
    level: config.get('LOG_LEVEL')      
  };

  if (config.get('LOGENTRIES_TOKEN')) {
    loggerSettings.streams = [ Logger.bunyanStream({ token: config.get('LOGENTRIES_TOKEN') }) ];
  }

  if (callingFileName) return bunyan.createLogger(loggerSettings);
}

module.exports = {
  getLogger
};
