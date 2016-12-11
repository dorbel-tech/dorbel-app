'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users_to_apartments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['landlord', 'tenant'],
        allowNull: false
      },
      apartment_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'apartments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    return queryInterface.dropTable('users_to_apartments');
  }
};
