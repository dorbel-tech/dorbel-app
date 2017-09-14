'use strict';
// Initial seed file for database
const co = require('co');
let db;

function findOrCreate(modelName, obj, transaction) {
  return db.models[modelName].findOrCreate({
    where: obj, transaction
  }).spread(result => result); // return just the first result which is the object found or created
}

function* createSeed(dbToSeed) {
  if (!dbToSeed) {
    db = require('../dbConnectionProvider');
    yield db.connect();
  }
  else {
    db = dbToSeed;
  }

  const israel = yield findOrCreate('country', {
    country_name: 'Israel',
    currency: '₪',
    size_unit: 'meter'
  });

  yield findOrCreate('city', {
    city_name: 'תל אביב יפו',
    country_id: israel.id
  });

  yield findOrCreate('city', {
    city_name: 'הרצליה',
    country_id: israel.id
  });
}

module.exports = {
  createSeed,
  up: function () {
    return co(createSeed);
  },
  down: function () {
    throw new Error('Not Implemented');
  }
};
