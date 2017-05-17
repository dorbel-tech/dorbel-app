'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.query('UPDATE apartments.listings SET future_booking = TRUE WHERE status IN (\'listed\',\'rented\');');
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.query('UPDATE apartments.listings SET future_booking = FALSE WHERE status IN (\'listed\',\'rented\');');
  }
};
