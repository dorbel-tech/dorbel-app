'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('image', {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_order: {
      type: DataTypes.FLOAT
    }
  }, {
    classMethods: {
      associate: models => models.image.belongsTo(models.listing, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      })
    }
  });
}

module.exports = define;
