'use strict';
const mapsApi = require('@google/maps');
const _ = require('lodash');

/* 

This migration adds a google_place_id column to the cities table.
It was created in order to prevent naming collisions (פ"ת\פתח תקווה) when Google places support will be added

*/
module.exports = {
  up: function (queryInterface) {
    // Add the column
    return queryInterface.sequelize.query(`
        SELECT *
        FROM cities`
    )
      .then((records) => { // Fill table with google_place_ids 
        const mapsApiClient = mapsApi.createClient({
          key: 'AIzaSyBBrTZ2QuWj6YYcqYlgmybT9TlQh7zquAA', // Hard coded because APT-API doen't have this environment var ATM (and Sequelize CLI doesn't include dorbel-shared/dotenv)
          Promise: Promise
        });

        return Promise.all( // Get autocomplete results in order to get the place_id
          records[0].map((record) => {
            return mapsApiClient.placesAutoComplete({ input: record.city_name }).asPromise()
              .then((autoCompRes) => {
                // First object with type locality is the city object 
                const cityObj = _.find(autoCompRes.json.predictions, (prediction) => {
                  return _.includes(prediction.types, 'locality');
                });

                return {
                  id: record.id,
                  city_name: cityObj.structured_formatting.main_text,
                  google_place_id: cityObj.place_id
                };
              });
          })
        )
          .then((data) => { // Fill the google_place_id column
            return Promise.all(data.map((item) => {
              return queryInterface.sequelize.query(
                'UPDATE cities ' +
                'SET city_name=\'' + item.city_name + '\',google_place_id=\'' + item.google_place_id + '\' ' +
                'WHERE ID=' + item.id
              );
            }));
          });
      });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.query(
      'UPDATE cities SET google_place_id=NULL'
    );
  }
};
