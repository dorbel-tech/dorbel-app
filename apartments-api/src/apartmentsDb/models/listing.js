'use strict';
const normalizeSlug = require('dorbel-shared').utils.generic.normalizeSlug;

function define(sequelize, DataTypes) {
  return sequelize.define('listing', {
    title: {
      type: DataTypes.STRING
    },
    description: DataTypes.STRING(500),
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'listed', 'rented', 'unlisted'],
      allowNull: false,
      defaultValue: 'pending'
    },
    monthly_rent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    roommates: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    property_tax: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'ארנונה לחודשיים'
    },
    board_fee: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'ועד בית'
    },
    lease_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lease_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    publishing_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    publishing_user_type: {
      type: DataTypes.ENUM('landlord', 'tenant'),
      allowNull: false
    },
    publishing_username: {
      type: DataTypes.VIRTUAL
    },
    roommate_needed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    slug: {
      type: DataTypes.STRING,
      defaultValue: null,
      set: function (val) {
        this.setDataValue('slug', normalizeSlug(val, true));
      }
    }
  },
    {
      classMethods: {
        associate: models => {
          models.listing.belongsTo(models.apartment, {
            foreignKey: {
              allowNull: false
            },
            onDelete: 'CASCADE'
          });
          models.listing.hasMany(models.image);
        }
      }
    });
}

module.exports = define;
