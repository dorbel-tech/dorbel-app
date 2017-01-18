'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('SequelizeMeta', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true 
    },
  }, {
    classMethods: {
      associate: () => {
      }
    },
    tableName: 'SequelizeMeta',
    
    timestamps: false,
  });

  return Model;
};

