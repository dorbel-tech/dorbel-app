'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('listing', {
    title: { type: DataTypes.STRING },
    description: DataTypes.STRING,
    status: { type: DataTypes.ENUM, values: ['pending_review', 'listed', 'pending_contract', 'rented', 'closed'], allowNull: false, defaultValue: 'pending_review' },
    monthly_rent: { type: DataTypes.INTEGER, allowNull: false },
    roommates: DataTypes.ENUM('not_suitable', 'possible', 'roommate_needed'),
    property_tax: { type: DataTypes.INTEGER, comment: 'ארנונה לחודשיים' },
    board_fee: { type: DataTypes.INTEGER, comment: 'ועד בית' },
    lease_start: { type: DataTypes.DATE, allowNull: false },
    lease_end: { type: DataTypes.DATE, allowNull: false },
    publishing_user_id: { type: DataTypes.UUID, allowNull: false },
    publishing_user_type: { type: DataTypes.ENUM, values: ['landlord', 'tenant'], allowNull: false }
  }, {
    classMethods: {
      associate: models => models.listing.belongsTo(models.apartment, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    }
  });
}

module.exports = define;
