'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('likes',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false
        },
        listing_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'listings',
            key: 'id'
          }
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
      });

    queryInterface.addIndex('likes',
      ['user_id', 'listing_id'],
      {
        indexName: 'primary_compound_index',
        indicesType: 'UNIQUE'
      }
    );
  },

  down: function (queryInterface) {
    queryInterface.dropTable('likes');
  }
};
