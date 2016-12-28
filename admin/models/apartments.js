'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('apartments', {
    apt_number: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    rooms: {
      type: DataTypes.DOUBLE,
    },
    floor: {
      type: DataTypes.INTEGER,
    },
    parking: {
      type: DataTypes.INTEGER,
    },
    sun_heated_boiler: {
      type: DataTypes.INTEGER,
    },
    pets: {
      type: DataTypes.INTEGER,
    },
    air_conditioning: {
      type: DataTypes.INTEGER,
    },
    balcony: {
      type: DataTypes.INTEGER,
    },
    security_bars: {
      type: DataTypes.INTEGER,
    },
    parquet_floor: {
      type: DataTypes.INTEGER,
    },
    building_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    classMethods: {
      associate: () => {
      }
    },
    tableName: 'apartments',
    underscored: true,
    
  });

  return Model;
};

