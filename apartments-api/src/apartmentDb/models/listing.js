'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('listing', {
    title: { type: DataTypes.STRING },
    description: DataTypes.STRING,
    status: { type: DataTypes.ENUM, values: ['pending', 'listed', 'rented', 'unlisted'], allowNull: false, defaultValue: 'pending' },
    monthly_rent: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    roommates: DataTypes.ENUM('allowed', 'disallowed'),
    property_tax: { type: DataTypes.DECIMAL(10,2), comment: 'ארנונה לחודשיים' },
    board_fee: { type: DataTypes.DECIMAL(10,2), comment: 'ועד בית' },
    lease_start: { type: DataTypes.DATE, allowNull: false },
    lease_end: { type: DataTypes.DATE, allowNull: false },
    publishing_user_id: { type: DataTypes.UUID, allowNull: false },
    publishing_user_type: { type: DataTypes.ENUM, values: ['landlord', 'tenant'], allowNull: false },
    roommate_needed: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    classMethods: {
      associate: models => models.listing.belongsTo(models.apartment, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    }
  });
}

module.exports = define;
