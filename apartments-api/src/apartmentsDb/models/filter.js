'use strict';

module.exports = function define(sequelize, DataTypes) {
  return sequelize.define('filter',
    {
      dorbel_user_id: { type: DataTypes.UUID, allowNull: false },
      email_notification: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

      city: DataTypes.INTEGER,
      neighborhood: DataTypes.INTEGER,
      min_monthly_rent: DataTypes.DECIMAL(10, 2),
      max_monthly_rent: DataTypes.DECIMAL(10, 2),
      min_rooms: DataTypes.DECIMAL(3, 1),
      max_rooms: DataTypes.DECIMAL(3, 1),
      air_conditioning: DataTypes.BOOLEAN,
      balcony: DataTypes.BOOLEAN,
      parking: DataTypes.BOOLEAN,
      pets: DataTypes.BOOLEAN,
      security_bars: DataTypes.BOOLEAN,
      elevator: DataTypes.BOOLEAN,
      min_lease_start: DataTypes.DATE,
      max_lease_start: DataTypes.DATE
    },
    {
      validate: {
        minimalFilter() {
          if (!this.city ||
              !(this.min_monthly_rent || this.max_monthly_rent) ||
              !(this.min_rooms || this.max_rooms)) {
            throw new Error('Missing filter minimal fields');
          }
        }
      }
    });
};

