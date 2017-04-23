'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('open_house_event', {
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
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'inactive', 'deleted'],
      allowNull: false,
      defaultValue: 'active'
    },
  }, {
    classMethods: {
      associate: models => {
        models.open_house_event.hasMany(models.registration, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });
}

module.exports = define;
