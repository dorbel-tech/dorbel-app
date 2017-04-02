'use strict';
const logger = require('dorbel-shared').logger.getLogger(module);

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      'SELECT ohe.listing_id, ohe.comments ' +
      'FROM open_house_events.open_house_events AS ohe ' +
      'WHERE ohe.comments IS NOT NULL', { type: Sequelize.QueryTypes.SELECT })
      .then((results) => {
        logger.info(`migrating ${results.length} listings`);
        results.forEach((res) => {
          queryInterface.sequelize.query(
            'UPDATE apartments.listings set directions = :directions ' +
            'WHERE id = :listing_id',
            {
              replacements: {
                listing_id: res.listing_id,
                directions: res.comments
              }
            }
          )
            .then((updateRes) => { logger.info({ data: res, res: updateRes }, 'GREAT SUCCESS: updated listing during comments/directions migration'); })
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
        logger.info(`reverting ${results.length} listings`);
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
            .then((updateRes) => { logger.info({ res: updateRes }, 'updated ohe during comments/directions migration revert'); })
            .catch((err) => { logger.error({ data: res, error: err }, 'faild to update ohe during comments/directions migration'); });
        });
      })
      .catch((err) => { logger.error({ error: err }, 'failed to read from apartments db'); });

  }
};
