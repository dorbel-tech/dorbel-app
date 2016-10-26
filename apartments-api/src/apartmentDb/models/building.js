'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('building', {
    street_name: { type: DataTypes.STRING, allowNull: false, unique: 'address' },
    house_number: { type: DataTypes.STRING, allowNull: false, unique: 'address' }
  }, {
    classMethods: {
      associate: models => models.building.belongsTo(models.city)
    },
    underscored: true
  });
}

module.exports = define;
