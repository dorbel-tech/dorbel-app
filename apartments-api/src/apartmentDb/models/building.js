'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('Building', {
    street_name: { type: DataTypes.STRING, allowNull: false },
    house_number: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate: function associate(models) {
        models.Building.hasMany(models.Apartment);
      }
    },
    indexes: [
      {
        fields: ['street_name', 'house_number'],
        unique: true
      }
    ]
  });
}

module.exports = define;
