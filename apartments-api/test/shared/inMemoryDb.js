'use strict';
const Sequelize = require('sequelize');
const modelLoader = require('../../src/apartmentsDb/models');
const seed = require('../../src/apartmentsDb/seeds/20161110101800-israel');
var mockRequire = require('mock-require');

module.exports.connect = function* connect() {
  const db = new Sequelize(undefined, undefined, undefined,
    {
      dialect: 'sqlite',
      storage: ':memory:',
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
  yield seed.createSeed(module.exports);
  mockRequire('../../src/apartmentsDb/dbConnectionProvider', module.exports);
};


