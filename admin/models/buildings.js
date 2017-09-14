'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('buildings', {
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
    elevator: DataTypes.BOOLEAN,
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },    
  }, {
    classMethods: {
      associate: models => {
        models.buildings.belongsTo(models.cities, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    },
    tableName: 'buildings',
    underscored: true,
    
  });

  return Model;
};

