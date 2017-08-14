'use strict';
// Initial seed file for database
const co = require('co');
let db;

function findOrCreate(modelName, obj, transaction) {
  return db.models[modelName].findOrCreate({
    where: obj, transaction
  }).spread(result => result); // return just the first result which is the object found or created
}

function createNeighborhoodsInCity(city, neighborhoodNames) {
  return db.db.transaction(transaction => { // these are done concurrently so need a transaction
    let promises = neighborhoodNames.map((neighborhood_name) =>
      findOrCreate('neighborhood', {
        neighborhood_name,
        city_id: city.id
      }, transaction)
    );

    return Promise.all(promises);
  });
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

  const telAviv = yield findOrCreate('city', {
    city_name: 'תל אביב יפו',
    google_place_id: 'ChIJH3w7GaZMHRURkD-WwKJy-8E',
    country_id: israel.id
  });

  const hertzelya = yield findOrCreate('city', {
    city_name: 'הרצליה',
    google_place_id: 'ChIJb-UlwQ1IHRURxMFKFMsjoEY',
    country_id: israel.id
  });

  yield createNeighborhoodsInCity(telAviv, ['מרכז העיר', 'הצפון הישן']);
  yield createNeighborhoodsInCity(hertzelya, ['ויצמן', 'גורדון']);

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
