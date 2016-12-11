'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      city_name: {
        type: Sequelize.STRING,
        allowNull: false, 
        unique: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: true
      },
      display_order: {
        type: Sequelize.FLOAT
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'countries',
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
    return queryInterface.dropTable('cities');
  }
};
