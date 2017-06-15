'use strict';

module.exports = function define(sequelize, DataTypes) {
  return sequelize.define('filter',
    {
      dorbel_user_id: { type: DataTypes.UUID, allowNull: false },
      email_notification: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

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
      future_booking: DataTypes.BOOLEAN,
      elevator: DataTypes.BOOLEAN
    },
    {
      validate: {
        minimalFilter() {
          if (['city', 'min_monthly_rent', 'max_monthly_rent', 'min_rooms', 'max_rooms'].some(field => !this.dataValues.hasOwnProperty(field))) {
            throw new Error('Missing filter minimal fields');
          }
        }
      }
    });
};

