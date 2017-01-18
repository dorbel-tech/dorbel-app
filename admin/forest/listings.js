'use strict';
var Liana = require('forest-express-sequelize');

Liana.collection('listings', {
  fields: [{
    field: 'listing_url',
    type: 'String',
    value: function (object) {
      return process.env.FRONT_GATEWAY_URL + 'apartments/' + object.id;
    }
  }]
});
