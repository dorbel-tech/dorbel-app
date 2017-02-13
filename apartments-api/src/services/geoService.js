'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const NodeGeocoder = require('node-geocoder');
const cityRepository = require('../apartmentsDb/repositories/cityRepository');
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
  const cityId = listing.apartment.building.city.id;
  const city = yield cityRepository.list({ id: cityId });

  if (city[0]) {
    const cityName = city[0].city_name;

    let geo = new Geo();
    let fullAddress = [
      listing.apartment.building.street_name,
      listing.apartment.building.house_number,
      cityName
    ].join(' '); // Full address in one string with spacing.
    return geo.coder.geocode(fullAddress)
      .then(res => {
        logger.debug({ res }, 'Got geo location of apartment.');
        if (res && res[0] && res[0].longitude) {
          var point = { type: 'Point', coordinates: [res[0].longitude, res[0].latitude] };
          listing.apartment.building.geolocation = point;
        }
        return listing;
      })
      .catch(err => {
        logger.error(err, 'Cant get geo location of apartment.');
        return listing;
      });
  }
  else {
    logger.error(`Unidentified cityId: ${cityId}`);
    return new Promise((resolve) => { resolve(listing); });
  }
}

module.exports = {
  setGeoLocation
};
