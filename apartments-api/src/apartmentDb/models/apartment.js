'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('Apartment', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    unit: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate: function associate(models) {
        models.Apartment.belongsTo(models.Building, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    },
    indexes: [
      {
        fields: ['BuildingId', 'unit'],
        unique: true
      }
    ]
  });
}

module.exports = define;
