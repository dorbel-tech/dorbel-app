'use strict';

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
      }
    },
    indexes: [{
      fields: ['city_id', 'street_name', 'house_number', 'entrance'],
      unique: true
    }]
  });
}

module.exports = define;
