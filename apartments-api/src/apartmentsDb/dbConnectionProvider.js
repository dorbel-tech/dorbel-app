'use strict';
const Sequelize = require('sequelize');
const shared = require('dorbel-shared');
const modelLoader = require('./models');

const MY_SQL_PORT = 3306;

module.exports.connect = function* connect() {
  yield shared.utils.waitForConnection({ host: process.env.RDS_HOSTNAME, port: MY_SQL_PORT });

  const db = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD,
    {
      host: process.env.RDS_HOSTNAME,
      pool: {
        max: 100,
        min: 0
      },
      logging: true,
      define: { // default definitions for models
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    }
  );

  module.exports.db = db;
  module.exports.models = modelLoader.load(db);
};
