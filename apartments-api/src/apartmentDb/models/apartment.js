'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('apartment', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    unit: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate: models => models.apartment.belongsTo(models.building)
    },
    indexes: [
      {
        fields: ['building_id', 'unit'],
        unique: true
      }
    ],
    underscored: true
  });
}

module.exports = define;
