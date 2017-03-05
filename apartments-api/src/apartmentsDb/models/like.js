'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('like',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      liked_user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      listing_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'listing',
          key: 'id'
        }
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      },
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
        }
      },
      indexes: [{
        fields: ['listing_id', 'liked_user_id'],
        unique: true
      }]
    });
}

module.exports = define;
