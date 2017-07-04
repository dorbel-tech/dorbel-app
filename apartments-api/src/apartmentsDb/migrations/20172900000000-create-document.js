'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('documents',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        dorbel_user_id: { type: Sequelize.UUID, allowNull: false },
        provider: { type: Sequelize.ENUM, values: ['filestack'], allowNull: false },
        provider_file_id: { type: Sequelize.STRING, allowNull: false },
        filename: { type: Sequelize.STRING, allowNull: false },
        type: Sequelize.STRING,
        size: Sequelize.INTEGER,

        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.dropTable('documents');
  }
};
