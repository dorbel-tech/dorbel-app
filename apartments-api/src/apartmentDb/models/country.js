'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('Country', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    currency: { type: DataTypes.STRING, allowNull: false },
    size_unit: { type: DataTypes.STRING, allowNull: false }
  }, {
    underscored: true
  });
}

module.exports = define;
