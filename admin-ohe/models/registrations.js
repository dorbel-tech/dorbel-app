'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  var Model = sequelize.define('registrations', {
    open_house_event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    registered_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
        const options = {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        };
        models.registrations.belongsTo(models.open_house_events, options);
      }
    },
    tableName: 'registrations',
    underscored: true,
    
  });

  return Model;
};

