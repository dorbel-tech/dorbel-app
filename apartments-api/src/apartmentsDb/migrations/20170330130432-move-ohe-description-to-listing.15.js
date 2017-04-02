'use strict';
const logger = require('dorbel-shared').logger.getLogger(module);

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'listings',
      'directions',
      Sequelize.STRING(255)
    );

    const ohe_listingId_to_comment_sql =
      'SELECT ohe.listing_id, ohe.comments ' +
      'FROM open_house_events.open_house_events AS ohe ' +
      'WHERE ohe.comments IS NOT NULL';

    const update_listing_directions_sql =
      'UPDATE apartments.listings set directions = :directions ' +
      'WHERE id = :listing_id';

    queryInterface.sequelize.query(
      ohe_listingId_to_comment_sql, { type: Sequelize.QueryTypes.SELECT })
      .then((results) => {
        logger.debug(`migrating ${results.length} listings`);
        results.forEach((res) => {
          queryInterface.sequelize.query(
            update_listing_directions_sql,
            {
              replacements: {
                listing_id: res.listing_id,
                directions: res.comments
              }
            }
          )
            .then((updateRes) => { logger.debug({ res: updateRes }, 'GREAT SUCCESS: updated listing during comments/directions migration'); })
            .catch((err) => { logger.error({ data: res, error: err }, 'faild to update listing during comments/directions migration'); });
        });
      })
      .catch((err) => { logger.error({ error: err }, 'failed to read from OHE db'); });

  },

  down: function (queryInterface, Sequelize) {
    const listings_id_to_directions_sql =
      'SELECT listings.id, listings.directions ' +
      'FROM apartments.listings AS listings ' +
      'WHERE listings.directions IS NOT NULL';

    const update_ohe_comments_sql =
      'UPDATE open_house_events.open_house_events set comments = :comments ' +
      'WHERE listing_id = :listing_id';

    queryInterface.sequelize.query(
      listings_id_to_directions_sql, { type: Sequelize.QueryTypes.SELECT })
      .then((results) => {
        logger.debug(`reverting ${results.length} listings`);
        results.forEach((res) => {
          queryInterface.sequelize.query(
            update_ohe_comments_sql,
            {
              replacements: {
                listing_id: res.id,
                comments: res.directions
              }
            }
          )
            .then((updateRes) => { logger.debug({ res: updateRes }, 'updated ohe during comments/directions migration revert'); })
            .catch((err) => { logger.error({ data: res, error: err }, 'faild to update ohe during comments/directions migration'); });
        });
      })
      .catch((err) => { logger.error({ error: err }, 'failed to read from apartments db'); });

    queryInterface.removeColumn(
      'listings',
      'directions'
    );
  }
};
