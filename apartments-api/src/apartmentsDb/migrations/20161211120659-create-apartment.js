'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('apartments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apt_number: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rooms: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      parking: {
        type: Sequelize.BOOLEAN
      },
      sun_heated_boiler: {
        type: Sequelize.BOOLEAN
      },
      pets: {
        type: Sequelize.BOOLEAN
      },
      air_conditioning: {
        type: Sequelize.BOOLEAN
      },
      balcony: {
        type: Sequelize.BOOLEAN
      },
      security_bars: {
        type: Sequelize.BOOLEAN
      },
      parquet_floor: {
        type: Sequelize.BOOLEAN
      },
      building_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'buildings',
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
    return queryInterface.dropTable('apartments');
  }
};
