'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'listed', 'rented', 'unlisted'], 
        allowNull: false, 
        defaultValue: 'pending'
      },
      monthly_rent: {
        type: Sequelize.DECIMAL(10,2), 
        allowNull: false
      },
      roommates: {
        type: Sequelize.ENUM,
        values: ['allowed', 'disallowed']
      },
      property_tax: {
        type: Sequelize.DECIMAL(10,2)
      },
      board_fee: {
        type: Sequelize.DECIMAL(10,2)
      },
      lease_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      lease_end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      publishing_user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      roommate_needed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false 
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
    return queryInterface.dropTable('listings');
  }
};
