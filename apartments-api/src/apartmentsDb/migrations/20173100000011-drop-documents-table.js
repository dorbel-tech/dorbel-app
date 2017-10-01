'use strict';

module.exports = {

  up: function (queryInterface) {
    queryInterface.dropTable('documents');
  },

  down: function (queryInterface, Sequelize) {
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
        filename: { type: Sequelize.STRING + ' CHARSET utf8 COLLATE utf8_unicode_ci', allowNull: false },
        type: Sequelize.STRING,
        size: Sequelize.INTEGER,

        listing_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'listings',
            key: 'id'
          }
        },

        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      }
    );
  }
};
