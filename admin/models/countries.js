'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('countries', {
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size_unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    classMethods: {
      associate: models => {
          Model.hasMany(models.cities);
      }
    },
    tableName: 'countries',
    underscored: true,
    
  });

  return Model;
};

