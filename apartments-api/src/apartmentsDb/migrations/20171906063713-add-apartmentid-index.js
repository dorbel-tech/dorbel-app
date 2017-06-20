'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'likes',
      'apartment_id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'apartments',
          key: 'id'
        }
      }
    )
    .then(() => {
      return queryInterface.addIndex('likes',
        ['liked_user_id', 'apartment_id'],
        {
          indexName: 'primary_compound_index',
          indicesType: 'UNIQUE'
        });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('likes', 'primary_compound_index')
      .then(() => {
        return queryInterface.changeColumn(
        'likes',
        'apartment_id',
          {
            type: Sequelize.INTEGER,
            allowNull: true
          }
        );
      });
  }
};
