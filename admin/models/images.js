'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('images', {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_order: {
      type: DataTypes.FLOAT
    },
    listing_id: {
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
      associate: models => models.images.belongsTo(models.listings, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      })
    },
    tableName: 'images',
    underscored: true,
    
  });

  return Model;
};

