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
        mrs: Sequelize.DECIMAL(10, 2),
        mre: Sequelize.DECIMAL(10, 2),
        minRooms: Sequelize.DECIMAL(3, 1),
        maxRooms: Sequelize.DECIMAL(3, 1),
        ac: Sequelize.BOOLEAN,
        balc: Sequelize.BOOLEAN,
        ele: Sequelize.BOOLEAN,
        park: Sequelize.BOOLEAN,
        pet: Sequelize.BOOLEAN,
        sb: Sequelize.BOOLEAN,
        futueBooking: Sequelize.BOOLEAN,

        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.dropTable('filters');
  }
};
