'use strict';
// Initial seed file for database
/* eslint no-console: "off" */

const co = require('co');
const db = require('../dbConnectionProvider');

function findOrCreate(modelName, obj) {
  return db.models[modelName].findOrCreate({
    where: obj
  }).spread(result => result); // return just the first result which is the object found or created
}

function createNeighborhoodsInCity(city, neighborhoodNames) {
  return neighborhoodNames.map((neighborhood_name, index) =>
    findOrCreate('neighborhood', {
      neighborhood_name,
      city_id: city.id,
      display_order: index + 1
    })
  );
}

function* createSeed() {
  yield db.connect();

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

  console.log('seed finished');
  process.exit();
}

if (require.main === module) { co(createSeed).catch(err => console.error(err.stack || err)); }
