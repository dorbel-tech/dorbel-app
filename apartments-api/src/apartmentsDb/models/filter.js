'use strict';

module.exports = function define(sequelize, DataTypes) {
  return sequelize.define('filter',
    {
      dorbel_user_id: { type: DataTypes.UUID, allowNull: false },
      email_notification: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

      city: DataTypes.INTEGER,
      neighborhood: DataTypes.INTEGER,
      mrs: DataTypes.DECIMAL(10, 2),
      mre: DataTypes.DECIMAL(10, 2),
      minRooms: DataTypes.DECIMAL(3, 1),
      maxRooms: DataTypes.DECIMAL(3, 1),
      ac: DataTypes.BOOLEAN,
      balc: DataTypes.BOOLEAN,
      ele: DataTypes.BOOLEAN,
      park: DataTypes.BOOLEAN,
      pet: DataTypes.BOOLEAN,
      sb: DataTypes.BOOLEAN,
      futueBooking: DataTypes.BOOLEAN
    },
    {
      validate: {
        minimalFilter() {
          if (['city', 'mrs', 'mre', 'minRooms', 'maxRooms'].some(field => !this.dataValues.hasOwnProperty(field))) {
            throw new Error('Missing filter minimal fields');
          }
        }
      }
    });
};

