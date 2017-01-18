'use strict';
var Liana = require('forest-express-sequelize');

Liana.collection('followers', {
  fields: [{
    field: 'listing_url',
    type: 'String',
    value: function (object) {
      return 'https://app.dorbel.com/apartments/' + object.listing_id;
    }
  }]
});