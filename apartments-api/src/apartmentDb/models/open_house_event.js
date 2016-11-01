'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('open_house_event', {
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    comments:  DataTypes.TEXT
  }, {
    classMethods: {
      associate: models => models.open_house_event.belongsTo(models.listing, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    }
  });
}

module.exports = define;

