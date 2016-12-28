'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('listings', {
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    monthly_rent: {
      type: DataTypes.DOUBLE,
    },
    roommates: {
      type: DataTypes.INTEGER,
    },
    property_tax: {
      type: DataTypes.DOUBLE,
    },
    board_fee: {
      type: DataTypes.DOUBLE,
    },
    lease_start: {
      type: DataTypes.DATE,
    },
    lease_end: {
      type: DataTypes.DATE,
    },
    publishing_user_id: {
      type: DataTypes.STRING,
    },
    roommate_needed: {
      type: DataTypes.INTEGER,
    },
    apartment_id: {
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
    tableName: 'listings',
    underscored: true,
    
  });

  return Model;
};

