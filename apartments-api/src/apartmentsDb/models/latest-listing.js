'use strict';
const listingAttributes = require('./shared/listingAttributes');

function define(sequelize) {
  return sequelize.define('latest_listing',
    // TODO: find a way to make read-only (either sequelize way is possible, or iterate and make setter throw an exception)
    listingAttributes,
    {
      // TODO: find a way to inherit from listing model
      classMethods: {
        associate: models => {
          models.latest_listing.belongsTo(models.apartment, {
            foreignKey: {
              allowNull: false
            },
            onDelete: 'CASCADE'
          });
          models.latest_listing.hasMany(models.image, { foreignKey: 'listing_id' });
          models.latest_listing.hasMany(models.like, { foreignKey: 'listing_id' });
        }
      }
    });
}

module.exports = define;
