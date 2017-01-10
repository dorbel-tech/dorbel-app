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
    comments: {
      type: DataTypes.STRING
    },
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publishing_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
