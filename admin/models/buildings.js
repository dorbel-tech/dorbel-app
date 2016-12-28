'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('buildings', {
    street_name: {
      type: DataTypes.STRING,
    },
    house_number: {
      type: DataTypes.STRING,
    },
    entrance: {
      type: DataTypes.STRING,
    },
    floors: {
      type: DataTypes.INTEGER,
    },
    geolocation: {
      type: DataTypes.INTEGER,
    },
    elevator: {
      type: DataTypes.INTEGER,
    },
    city_id: {
      type: DataTypes.INTEGER,
    },
    neighborhood_id: {
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
    tableName: 'buildings',
    underscored: true,
    
  });

  return Model;
};

