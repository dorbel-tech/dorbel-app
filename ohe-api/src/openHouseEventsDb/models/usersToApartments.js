'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('usersToApartments', {
    user_id: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.ENUM, values: ['landlord', 'tenant'], allowNull: false },
  }, {
    classMethods: {
      associate: models => models.listing.belongsTo(models.apartment, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    }
  });
}

module.exports = define;
