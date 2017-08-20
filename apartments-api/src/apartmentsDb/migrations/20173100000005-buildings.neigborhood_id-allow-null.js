'use strict';
module.exports = {
  up: function (queryInterface) {
    return queryInterface.changeColumn('buildings', 'neighbourhood_id', {
      allowNull: true
    });
  },

  down: function (queryInterface) {
    return queryInterface.changeColumn('buildings', 'neighbourhood_id', {
      allowNull: false
    });
  }
};
