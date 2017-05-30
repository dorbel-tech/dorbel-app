'use strict';

/* 

  This migration was in order to solve an issue with the previous view definition:
    * The case:
      - a listing was created for publishing (ID == 1)
      - then the same apartment was uploaded for management with a past date (ID == 2)
    * The result:
      - when searching, the listing for publishing (ID == 1) would not return in the search results

    * The solution is to create the view based on:
      - Querying listings table in order to get a collection of: apartment_id, MAX(lease_end)
      - Using the collection above, we query listings again by joining on apartment_id AND lease end

*/

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'DROP VIEW latest_listings', { type: Sequelize.QueryTypes.RAW })
      .then(() => {
        return queryInterface.sequelize.query(
          'CREATE VIEW latest_listings AS '+
              'SELECT listings.* '+ 
              'FROM '+
                  '(SELECT apartment_id, MAX( lease_end ) as lease_end '+
                  'FROM listings '+
                  'WHERE listings.status <> \'deleted\' '+
                  'GROUP BY apartment_id) as apt_id_lease_end ' +
              'INNER JOIN listings ON ' +
                  'listings.apartment_id = apt_id_lease_end.apartment_id ' +
                  'AND listings.lease_end = apt_id_lease_end.lease_end '
        , { type: Sequelize.QueryTypes.RAW });
      })
      .then(()=>{
        return queryInterface.addIndex('listings', ['apartment_id', 'lease_end']);
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'DROP VIEW latest_listings', { type: Sequelize.QueryTypes.RAW })
      .then(()=>{
        return queryInterface.sequelize.query(
          'CREATE VIEW latest_listings AS SELECT * FROM listings WHERE id IN ( ' +
          'SELECT MAX(id) FROM listings WHERE status != \'deleted\'' +
          'GROUP BY apartment_id' +
          ')', { type: Sequelize.QueryTypes.RAW }
          );
      })
      .then(()=>{
        return queryInterface.removeIndex('listings', ['apartment_id', 'lease_end']);
      });
  }
};
