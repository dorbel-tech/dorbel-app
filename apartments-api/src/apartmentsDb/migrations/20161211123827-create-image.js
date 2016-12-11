'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false, 
        unique: true
      },
      display_order: {
        type: Sequelize.FLOAT
      },
      listing_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'listings',
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
    return queryInterface.dropTable('images');
  }
};
