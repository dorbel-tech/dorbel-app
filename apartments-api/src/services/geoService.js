'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const NodeGeocoder = require('node-geocoder');
let geoCoderInstance = null;

// TODO : separate 'services' from 'providers' ? 

// NodeGeocoder client singleton class.
class Geo{  
  constructor() {
    if(!geoCoderInstance){ 
      this.coder = NodeGeocoder({ provider: 'google'});
      geoCoderInstance = this; 
    }    
    return geoCoderInstance;
  }
}

function* setGeoLocation(listing) {
  let geo = new Geo();
  let fullAddress = [  
    listing.apartment.building.street_name,
    listing.apartment.building.house_number,
    listing.apartment.building.city.city_name
  ].join(' '); // Full address in one string with spacing.
  return geo.coder.geocode(fullAddress)
    .then(res => {
      logger.debug({ res }, 'Got geo location of apartment.');
      if (res && res[0] && res[0].longitude) {
        var point = { type: 'Point', coordinates: [ res[0].longitude, res[0].latitude ]};
        listing.apartment.building.geolocation = point;
      }
      return listing;

    })
    .catch(err => {
      logger.error(err, 'Cant get geo location of apartment.');
      return listing;
    });
}

module.exports = {
  setGeoLocation
};
