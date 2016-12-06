'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('notification', {
    notificationType: { type: DataTypes.STRING, allowNull: false },
    scheduledTo: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'in-flight', 'sent', 'canceled'), allowNull: false },
    relatedObjectType: { type: DataTypes.STRING, allowNull: false },
    relatedObjectId: { type: DataTypes.INTEGER, allowNull: false },
    user_uuid: { type: DataTypes.STRING, allowNull: true }
  });
}

module.exports = define;
