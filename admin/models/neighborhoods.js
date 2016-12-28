'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('neighborhoods', {
    neighborhood_name: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
    city_id: {
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
    tableName: 'neighborhoods',
    underscored: true,
    
  });

  return Model;
};

