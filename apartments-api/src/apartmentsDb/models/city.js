'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('city',
    {
      city_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      display_order: {
        type: DataTypes.FLOAT
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      google_place_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      }
    },
    {
      classMethods: {
        associate: models => models.city.belongsTo(models.country, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        })
      }
    });
}

module.exports = define;
