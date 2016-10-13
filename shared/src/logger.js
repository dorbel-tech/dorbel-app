'use strict';
const config = require('./config');
const bunyan = require('bunyan');
const Logger = require('le_node');

function getLogger(callingModule) {
  let callingFileName;
  
  if (callingModule) {
    callingFileName = callingModule.filename.split('/').pop();
  }

  console.log('!!!!!!!!!!!!!!!!!', config.get('NODE_ENV'));
  console.log('!!!!!!!!!!!!!!!!!', config.get('LOG_LEVEL'));
  console.log('!!!!!!!!!!!!!!!!!', config.get('LOGENTRIES_TOKEN'));

  if (callingFileName) return bunyan.createLogger({ 
    name: callingFileName, 
    level: config.get('LOG_LEVEL'), 
    streams: [ Logger.bunyanStream({ token: config.get('LOGENTRIES_TOKEN') }) ] 
  });
}

module.exports = {
  getLogger
};
