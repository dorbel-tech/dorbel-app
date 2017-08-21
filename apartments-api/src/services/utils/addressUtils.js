'use-strict';
const _ = require('lodash');
const shared = require('dorbel-shared');
const googleMaps = require('@google/maps');
const errors = shared.utils.domainErrors;
const cache = shared.utils.cache;
const ADDRESS_CACHE_KEY_PREFIX = 'ADDR_CACHE';
const ADDRESS_CACHE_TTL = process.env.ADDRESS_CACHE_TTL || 60 * 60 * 24; // Fallback to 24 hours

class MapsApiWrapper {
  static get client() {
    if (this.mapsApiClient) { return this.mapsApiClient; }
    else {
      try {
        return this.mapsApiClient = googleMaps.createClient({
          key: process.env.GOOGLE_MAPS_API_KEY,
          Promise: Promise
        });
      }
      catch (ex) {
        this.mapsApiClient = undefined;
        throw ex;
      }
    }
  }
}

async function enrichCity(city) {
  const cityPredictions = await getCityPredictions(city.city_name);
  if (cityPredictions[0]) {
    return city = {
      country_id: 1,
      city_name: cityPredictions[0].structured_formatting.main_text,
      google_place_id: cityPredictions[0].place_id
    };
  }
  else { throw new errors.DomainValidationError('InvalidCity', city); }
}

async function getCityPredictions(city_name) {
  const query = `${city_name}, ישראל`;
  const cityPredictions = await getGooglePlacesAutocomplete(query, '(cities)');
  return cityPredictions;
}

async function getGooglePlacesAutocomplete(input, types) {
  const cacheKey = `${ADDRESS_CACHE_KEY_PREFIX}_${types}_${input}`;
  const cachedData = await cache.getKey(cacheKey);
  if (_.isNil(cachedData)) {
    try {
      const autoCompRes = await MapsApiWrapper.client.placesAutoComplete({ input, types }).asPromise();
      const { predictions } = autoCompRes.json;
      cache.setKey(cacheKey, JSON.stringify(predictions), ADDRESS_CACHE_TTL);
      return predictions;
    }
    catch (ex) {
      // TODO: Handle error
      throw ex;
    }
  }
  else { return JSON.parse(cachedData); }
}

async function getGooglePlacesGeocode(address) {
  let geocodeResponse;
  try {
    geocodeResponse = await MapsApiWrapper.client.geocode({ address }).asPromise();
  }
  catch (ex) {
    // TODO: Handle error
    throw ex;
  }
  const { results } = geocodeResponse.json;
  if (results && results[0]) {
    return results[0].geometry.location;
  }

async function isAddressValid(address) {
  const predictions = await getGooglePlacesAutocomplete(address, 'address');
  return (predictions[0] && predictions[0].description == address);
}

async function validateAndEnrichBuilding(building) {
  const addressString = `${building.street_name}, ${building.city.city_name}, ישראל`;
  const isValid = await isAddressValid(`${building.street_name}, ${building.city.city_name}, ישראל`, 'address');
  if (isValid) {
    const cityObj = await enrichCity(building.city);
    const geocode = await getGooglePlacesGeocode(`${building.street_name}, ${building.city.city_name} ${building.house_number}, ישראל`);
    building.city = cityObj;
    building.geolocation = {
      type: 'Point',
      coordinates: [geocode.lng, geocode.lat]
    };

    return building;
  }
  else { throw new errors.DomainValidationError('AddressNotMatched', { building, addressString }); }
}


module.exports = {
  validateAndEnrichBuilding
};
