'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('neighborhood', {
    neighborhood_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    display_order: {
      type: DataTypes.FLOAT
    }
  }, {
    classMethods: {
      associate: models => models.neighborhood.belongsTo(models.city, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      })
    },
    indexes: [{
      fields: ['city_id', 'neighborhood_name'],
      unique: true
    }]
  });
}

module.exports = define;
