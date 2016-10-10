'use strict';
const Sequelize = require('sequelize');
const net = require('net');
const shared = require('dorbel-shared');
const modelLoader = require('./models');

const config = shared.config;
const logger = shared.logger.getLogger(module);

const ATTEMPTS_TO_CONNECT = 10;
const RETRY_PERIOD_MS = 3000;
const MY_SQL_PORT = 3306;

function attemptConnection(retries) {
  return new Promise((resolve, reject) => {
    if (retries === 0) {
      logger.error('DB was not available, exiting ...');
      return reject();
    }

    setTimeout(() => {
      net.connect(MY_SQL_PORT, config.get('RDS_HOSTNAME'), () => {
        logger.info('DB Available');
        resolve(true);
      }).on('error', () => {
        logger.error('Failed to find DB');
        resolve(attemptConnection(retries--));
      });
    }, retries === ATTEMPTS_TO_CONNECT ? 0 : RETRY_PERIOD_MS);
  });
}

module.exports.connect = function* connect() {
  yield attemptConnection(ATTEMPTS_TO_CONNECT);

  const db = new Sequelize(config.get('RDS_DB_NAME'), config.get('RDS_USERNAME'), config.get('RDS_PASSWORD'),
    {
      host: config.get('RDS_HOSTNAME'),
      pool: {
        max: 10,
        min: 0
      },
      logging: false
    }
  );

  module.exports.db = db;
  module.exports.models = modelLoader.load(db);
  yield db.sync();
};
