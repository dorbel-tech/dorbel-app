'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('apartment', {
    unit: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    rooms: { type: DataTypes.DECIMAL(3, 1) , allowNull: false },
    floor: { type: DataTypes.INTEGER, allowNull: false },
    parking: DataTypes.BOOLEAN,
    sun_heated_boiler: DataTypes.BOOLEAN,
    pets: DataTypes.BOOLEAN,
    air_conditioning: DataTypes.BOOLEAN,
    balcony: DataTypes.BOOLEAN,
    security_bars: DataTypes.BOOLEAN,
    parquet_floor: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: models => models.apartment.belongsTo(models.building, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    },
    indexes: [
      {
        fields: ['building_id', 'unit'],
        unique: true
      }
    ]
  });
}

module.exports = define;
