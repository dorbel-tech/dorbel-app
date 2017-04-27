'use strict';

module.exports = function define(sequelize, DataTypes) {
  return sequelize.define('listingUser',
    {
      user_uuid: DataTypes.UUID,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      type: {
        type: DataTypes.ENUM,
        values: ['tenant', 'landlord'],
        allowNull: false,
        defaultValue: 'tenant'
      }
    },
    {
      classMethods: {
        associate: models => {
          models.listingUser.belongsTo(models.listing, {
            foreignKey: { allowNull: false }
          });
        }
      }
    });
};

