'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('like',
    {
      liked_user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      classMethods: {
        associate: models => {
          const options = {
            foreignKey: {
              allowNull: false
            },
            onDelete: 'CASCADE'
          };
          models.like.belongsTo(models.listing, options);
          models.like.belongsTo(models.apartment, options);
        }
      },
      indexes: [{
        fields: ['apartment_id', 'liked_user_id'],
        unique: true
      }]
    });
}

module.exports = define;
