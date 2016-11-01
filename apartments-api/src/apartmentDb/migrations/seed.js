'use strict';
// Initial seed file for database
/* eslint no-console: "off" */
const co = require('co');
let db;

function findOrCreate(modelName, obj, transaction) {
  return db.models[modelName].findOrCreate({
    where: obj, transaction
  }).spread(result => result); // return just the first result which is the object found or created
}

function createNeighborhoodsInCity(city, neighborhoodNames) {
  return db.db.transaction(transaction => { // these are done concurrently so need a transaction
    let promises = neighborhoodNames.map((neighborhood_name, index) =>
      findOrCreate('neighborhood', {
        neighborhood_name,
        city_id: city.id,
        display_order: index + 1
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
    city_name: 'תל אביב',
    country_id: israel.id,
    display_order: 1
  });

  const hertzelya = yield findOrCreate('city', {
    city_name: 'הרצליה',
    country_id: israel.id,
    display_order: 2
  });

  yield createNeighborhoodsInCity(telAviv, ['מרכז העיר', 'הצפון הישן']);
  yield createNeighborhoodsInCity(hertzelya, ['ויצמן', 'גורדון']);

}

if (require.main === module) {
  co(createSeed)
    .then(() => {
      console.log('seed finished');
      process.exit();
    })
    .catch(err => {
      console.error(err.stack || err);
      process.exit(-1);
    });
}

module.exports = {
  createSeed
};
