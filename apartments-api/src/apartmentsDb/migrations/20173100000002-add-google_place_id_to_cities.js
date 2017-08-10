'use strict';
const mapsApi = require('@google/maps');
const _ = require('lodash');

/* 

This migration adds a google_place_id column to the cities table.
It was created in order to prevent naming collisions (פ"ת\פתח תקווה) when Google places support will be added

*/
module.exports = {
  up: function (queryInterface, Sequelize) {
    // Add the column
    return queryInterface.addColumn('cities',
      'google_place_id',
      {
        type: Sequelize.STRING(50),
        allowNull: true
      })
      // Get existing data in order to enrich it
      .then(() => {
        return queryInterface.sequelize.query(`
        SELECT *
        FROM cities`
        );
      })
      .then((records) => { // Fill table with google_place_ids 
        const mapsApiClient = mapsApi.createClient({
          key: 'AIzaSyBBrTZ2QuWj6YYcqYlgmybT9TlQh7zquAA', // Hard coded because APT-API doen't have this environment var (and Sequelize CLI doesn't include dorbel-shared/dotenv)
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
      })
      // After we filled our columns we disable null and add a unique constraint
      .then(() => {
        return queryInterface.changeColumn('cities', 'google_place_id', {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING(50) // 'type' is repeated because Sequelize threw a weird error. Google said it will fix it and it did 
        });
      });
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'cities',
      'google_place_id'
    );
  }
};
