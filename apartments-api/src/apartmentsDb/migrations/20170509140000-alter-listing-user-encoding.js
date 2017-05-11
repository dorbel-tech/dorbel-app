'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const newColumnEncoding = { type: Sequelize.STRING() + ' CHARSET utf8 COLLATE utf8_unicode_ci' };

    return queryInterface.changeColumn('listingUsers', 'first_name', newColumnEncoding)
    .then(() => queryInterface.changeColumn('listingUsers', 'last_name', newColumnEncoding));
  },
  down: function (queryInterface, Sequelize) {
    const oldColumnEncoding = { type: Sequelize.STRING() + ' CHARSET latin1 COLLATE latin1_bin' };

    return queryInterface.changeColumn('listingUsers', 'first_name', oldColumnEncoding)
    .then(() => queryInterface.changeColumn('listingUsers', 'last_name', oldColumnEncoding));
  }
};
