'use strict';
const Sequelize = require('sequelize');
const shared = require('dorbel-shared');
const modelLoader = require('./models');

const config = shared.config;
const MY_SQL_PORT = 3306;

module.exports.connect = function* connect() {
  yield shared.utils.waitForConnection({ host: config.get('RDS_HOSTNAME'), port: MY_SQL_PORT });

  const db = new Sequelize(config.get('RDS_DB_NAME'), config.get('RDS_USERNAME'), config.get('RDS_PASSWORD'),
    {
      host: config.get('RDS_HOSTNAME'),
      pool: {
        max: 10,
        min: 0
      },
      logging: false,
      define: { // default definitions for models
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    }
  );

  module.exports.db = db;
  module.exports.models = modelLoader.load(db);
  yield db.sync();     
};
