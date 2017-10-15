'use strict';

module.exports = {
  up: function (queryInterface) {
    queryInterface.dropTable('listingUsers');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.createTable('listingUsers',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        listing_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'listings',
            key: 'id'
          }
        },
        dorbel_user_id: {
          type: Sequelize.UUID
        },
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        type: {
          type: Sequelize.ENUM,
          values: ['tenant', 'landlord'],
          allowNull: false,
          defaultValue: 'tenant'
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }
    );
  }
};
