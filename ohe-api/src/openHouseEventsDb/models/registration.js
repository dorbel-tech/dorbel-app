'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('registration', {
    open_house_event_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id:  { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false }
  });
}

module.exports = define;
