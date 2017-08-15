'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const NodeGeocoder = require('node-geocoder');
const cityRepository = require('../apartmentsDb/repositories/cityRepository');
let geoCoderInstance = null;

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

async function getGeoLocation(building) {
  const cityId = building.city.id;
  const city = await cityRepository.list({ id: cityId });

  if (city[0]) {
    const cityName = city[0].city_name;

    let geo = new Geo();
    let fullAddress = [
      building.street_name,
      building.house_number,
      cityName
    ].join(' '); // Full address in one string with spacing.

    try {
      const res = await geo.coder.geocode(fullAddress);
      logger.trace({ fullAddress, res }, 'Got geo location of apartment.');
      if (res && res[0] && res[0].longitude) {
        var point = { type: 'Point', coordinates: [res[0].longitude, res[0].latitude] };
        return point;
      }
    } catch (err) {
      // errors here are silenced
      logger.error(err, 'Cant get geo location of apartment.');
    }
  }
  else {
    logger.error(`Unidentified cityId: ${cityId}`);
  }
}

module.exports = {
  getGeoLocation
};
