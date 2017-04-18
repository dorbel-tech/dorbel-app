'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('open_house_events', {
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    max_attendies: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publishing_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: { // TODO: remove after migration to status is done.
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'inactive', 'deleted'],
      allowNull: false,
      defaultValue: 'active'
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
        models.open_house_events.hasMany(models.registrations, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    },
    tableName: 'open_house_events',
    underscored: true,
    
  });

  return Model;
};

