'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('ohe', {
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    listing_id: { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false }
  });
}

module.exports = define;
