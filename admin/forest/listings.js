'use strict';
var Liana = require('forest-express-sequelize');
var _ = require('lodash');

function sortImages(images) {
  return images.length ? _.orderBy(images, ['display_order']) : [];
}

Liana.collection('listings', {
  fields: [{
      field: 'image_url',
      type: 'String',
      value: function (object) {
        return object.getImages().then((images) => {
          var listingImage = sortImages(images);
          return listingImage.length ? listingImage[0].url : null;
        });
      }
    }, {
    field: 'listing_url',
    type: 'String',
    value: function (object) {
      return process.env.FRONT_GATEWAY_URL + 'apartments/' + object.apartment_id;
    }
  }]
});
