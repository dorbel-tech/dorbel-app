'use strict';
var Liana = require('forest-express-sequelize');

Liana.collection('followers', {
  fields: [{
    field: 'listing_url',
    type: 'String',
    value: function (object) {
      return process.env.FRONT_GATEWAY_URL + 'apartments/' + object.listing_id;
    }
  }]
});
