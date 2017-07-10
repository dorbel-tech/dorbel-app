'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // for supporting hebrew file names
    return queryInterface.changeColumn('documents', 'filename', 
      { type: Sequelize.STRING() + ' CHARSET utf8 COLLATE utf8_unicode_ci' });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('documents', 'filename', 
      { type: Sequelize.STRING() + ' CHARSET latin1 COLLATE latin1_bin' });
  }
};
