'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('follower', {
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    following_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
}

module.exports = define;
