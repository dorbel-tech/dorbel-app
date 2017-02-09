'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('apartments', {
    apt_number: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rooms: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parking: DataTypes.BOOLEAN,
    sun_heated_boiler: DataTypes.BOOLEAN,
    pets: DataTypes.BOOLEAN,
    air_conditioning: DataTypes.BOOLEAN,
    balcony: DataTypes.BOOLEAN,
    security_bars: DataTypes.BOOLEAN,
    parquet_floor: DataTypes.BOOLEAN,
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },    
  }, {
    classMethods: {
      associate: models => {
        const options = {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        };
        models.apartments.belongsTo(models.buildings, options);
      }
    },
    tableName: 'apartments',
    underscored: true,
    
  });

  return Model;
};

