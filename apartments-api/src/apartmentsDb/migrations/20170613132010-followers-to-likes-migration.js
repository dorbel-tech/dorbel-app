'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
        'INSERT IGNORE INTO apartments.likes (liked_user_id, listing_id, is_active, created_at, updated_at)' +
        'SELECT following_user_id as liked_user_id, listing_id, is_active, created_at, updated_at' +
        'FROM open_house_events.followers' +
        'WHERE is_active=true'
        , { type: Sequelize.QueryTypes.RAW });
  }
};
