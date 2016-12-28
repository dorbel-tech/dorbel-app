'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('countries', {
    country_name: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    size_unit: {
      type: DataTypes.STRING,
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
    tableName: 'countries',
    underscored: true,
    
  });

  return Model;
};

