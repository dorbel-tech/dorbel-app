'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('filters',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        dorbel_user_id: { type: Sequelize.UUID, allowNull: false },
        email_notification: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

        city: Sequelize.INTEGER,
        neighborhood: Sequelize.INTEGER,
        min_monthly_rent: Sequelize.DECIMAL(10, 2),
        max_monthly_rent: Sequelize.DECIMAL(10, 2),
        min_rooms: Sequelize.DECIMAL(3, 1),
        max_rooms: Sequelize.DECIMAL(3, 1),
        air_conditioning: Sequelize.BOOLEAN,
        balcony: Sequelize.BOOLEAN,
        parking: Sequelize.BOOLEAN,
        elevator: Sequelize.BOOLEAN,
        pets: Sequelize.BOOLEAN,
        security_bars: Sequelize.BOOLEAN,
        future_booking: Sequelize.BOOLEAN,

        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.dropTable('filters');
  }
};
