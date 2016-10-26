'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('city', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    display_order: { type: DataTypes.INTEGER }
  }, {
    classMethods: {
      associate: models => models.city.belongsTo(models.country)
    },
    underscored: true
  });
}

module.exports = define;
