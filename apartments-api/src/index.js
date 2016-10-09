'use strict';
const co = require('co');
const shared = require('dorbel-shared');
shared.config.setConfigFileFolder(__dirname + '/config'); // load config from file before anything else

const db = require('./apartmentDb/dbConnectionProvider');
const logger = shared.logger.getLogger(module);

let app;

co(function* () {
  try {
    yield db.connect();
    const server = require('./server/server'); // server should be required only after db connect finish
    app = server.listen();
  } catch (ex) {
    logger.error('failed to bootstrap application', ex);
    process.exit(-1);
  }
});

module.exports = {
  app
};
