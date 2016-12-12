'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('followers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      listing_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      following_user_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('followers');
  }
};
