// This file creates the all tables based on models using DB sync.
'use strict';
const Sequelize = require('sequelize');
const shared = require('dorbel-shared');
const modelLoader = require('../models');

const config = shared.config;

module.exports = {
  up: function() {
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
    return db.sync();     
  },
  down: function() {
  }
};
