'use strict';
const _ = require('lodash');

function define(sequelize, DataTypes) {
  return sequelize.define('building', {
    street_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    house_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entrance: {
      type: DataTypes.STRING,
      allowNull: true
    },
    floors: DataTypes.INTEGER,
    geolocation: DataTypes.GEOMETRY('POINT'),
    elevator: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: models => {
        models.building.belongsTo(models.city, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        models.building.belongsTo(models.neighborhood);
      },
      isDifferentBuilding: (building1, building2) => {
        return ['city.id', 'neighborhood.id', 'street_name', 'house_number', 'entrance'].some(field => {
          const value1 = _.get(building1, field);
          const value2 = _.get(building2, field);
          return value1 && value2 && value1 !== value2; // both have value and not equal values
        });
      }
    },
    indexes: [{
      fields: ['city_id', 'street_name', 'house_number', 'entrance'],
      unique: true
    }]
  });
}

module.exports = define;
