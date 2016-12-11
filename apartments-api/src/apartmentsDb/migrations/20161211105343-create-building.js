'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('buildings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      street_name: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      house_number: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      entrance: {
        type: Sequelize.STRING
      },
      floors: {
        type: Sequelize.INTEGER
      },
      geolocation: {
        type: Sequelize.GEOMETRY('POINT')
      },
      elevator: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      neighborhood_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'neighborhoods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('buildings');
  }
};
