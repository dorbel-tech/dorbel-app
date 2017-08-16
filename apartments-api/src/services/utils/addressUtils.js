'use-strict';
const errors = require('dorbel-shared').utils.domainErrors;
const _ = require('lodash');

const mapsApiClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

async function enrichCity(city) {
  const cityPrediction = await getCityPrediction(city.city_name);
  return city = {
    country_id: 1,
    city_name: cityPrediction.structured_formatting.main_text,
    google_place_id: cityPrediction.place_id
  };
}

async function getCityPrediction(city_name) {
  const query = `${city_name}, ישראל`;
  const cityPrediction = await getGooglePlacesPrediction(query, '(cities)');
  if (cityPrediction) {
    return cityPrediction;
  }
  else { throw new errors.DomainValidationError('InvalidCity', city_name); }
}

async function getGooglePlacesPrediction(input, types) {
  const autoCompRes = await mapsApiClient.placesAutoComplete({ input, types }).asPromise();
  const predictions = autoCompRes ? autoCompRes.json.predictions : undefined;
  if (predictions && predictions.length > 0 && predictions[0].description == input) {
    return predictions[0];
  }
  else { throw new errors.DomainValidationError('AddressNotMatched', input); }
}

async function getGooglePlacesGeocode(address) {
  const geocodeResponse = await mapsApiClient.geocode({ address }).asPromise();
  const { results } = geocodeResponse.json;
  if (results && results[0]) {
    return results[0].geometry.location;
  }
  else { throw new errors.DomainValidationError('GeocodeResolutionError', address); }
}

async function validateAddress(address) {
  await getGooglePlacesPrediction(address, 'address');
}

async function parseBuildingObject(building) {
  const addressString = `${building.street_name}, ${building.city.city_name}, ישראל`;
  await validateAddress(addressString, 'address');
  const cityObj = await enrichCity(building.city);
  const geocode = await getGooglePlacesGeocode(addressString);
  building.city = cityObj;
  building.geolocation = {
    type: 'Point',
    coordinates: [geocode.lng, geocode.lat]
  };

  return building;
}


module.exports = {
  parseBuildingObject
};
