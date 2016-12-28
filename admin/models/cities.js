'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('cities', {
    city_name: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
    country_id: {
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
    tableName: 'cities',
    underscored: true,
    
  });

  return Model;
};

