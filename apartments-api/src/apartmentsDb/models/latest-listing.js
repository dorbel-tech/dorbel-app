'use strict';
const listing = require('./listing');

function define(sequelize) {
  return sequelize.define('latest_listing',
    listing.attributes,
    {
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
