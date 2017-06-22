'use strict';
const listingAttributes = require('./shared/listingAttributes');

function define(sequelize) {
  return sequelize.define('listing',
    listingAttributes,
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
