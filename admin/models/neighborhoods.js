'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('neighborhoods', {
    neighborhood_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    display_order: {
      type: DataTypes.FLOAT
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
        Model.belongsTo(models.cities, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        Model.hasMany(models.buildings);
      }
    },
    tableName: 'neighborhoods',
    underscored: true,
    
  });

  return Model;
};

