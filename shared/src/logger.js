'use strict';
const bunyan = require('bunyan');
const config = require('./config');
const Logger = require('le_node');

const loggerDefinition = Logger.bunyanStream({ token: config.get('LOGENTRIES_TOKEN') });
const generalLogger = bunyan.createLogger({ name: 'general', level: config.get('LOG_LEVEL'), streams: [ loggerDefinition ] });

function getLogger(callingModule) {
  let callingFileName;
  if (callingModule) callingFileName = callingModule.filename.split('/').pop();

  if (callingFileName) return bunyan.createLogger({ 
    name: callingFileName, 
    level: config.get('LOG_LEVEL'), 
    streams: [ loggerDefinition ] 
  });
  else return generalLogger;
}

module.exports = {
  getLogger
};
