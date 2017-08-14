'use-strict';
const errors = require('dorbel-shared').utils.domainErrors;
const _ = require('lodash');

const mapsApiClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

class AddressUtils {
  static async validateAddress(addressString) {
    if (addressString && (addressString.match(/,/g) || []).length == 3 && addressString.endsWith('ישראל')) {
      const predictions = await this.getGooglePlacesPredictions(addressString);
      if (!predictions || predictions[0] != addressString) {
        throw new errors.DomainValidationError('AddressNotMatched', addressString);
      }
    }
    else { throw new errors.DomainValidationError('BadAddressFormat', addressString); }
  }

  static async getGooglePlacesPredictions(input) {
    const autoCompRes = await mapsApiClient.placesAutoComplete({ input }).asPromise();
    const { predictions } = autoCompRes.json;
    return predictions || [];
  }

  static async parseCity(cityPart) {
    const googleLocality = await this.getGooglePlacesLocality(cityPart);
    return {
      city_name: googleLocality.structured_formatting.main_text,
      google_place_id: googleLocality.place_id
    };
  }


  static async getGooglePlacesLocality(cityPart) {
    const predictions = await this.getGooglePlacesPredictions(cityPart);
    const cityPrediction = _.find(predictions, (prediction) => { _.includes(prediction.types, 'locality'); });
    if (cityPrediction) {
      return cityPrediction;
    }
    else { throw new errors.DomainValidationError('InvalidCity', cityPart); }
  }

  static async getGooglePlacesGeocode(address) {
    const geocodeResponse = await mapsApiClient.geocode({ address }).asPromise();
    const { results } = geocodeResponse.json;
    if (results && results[0]) {
      return results[0].geometry.location;
    }
    else { throw new errors.DomainValidationError('GeocodeResolutionError', address); }
  }

  static parseStreetAndHouseNumber(streetPart) {
    const house_number = parseInt(streetPart.split(/\s/).pop());
    if (house_number && streetPart.length > 0) {
      return {
        house_number,
        street_name: streetPart.join()
      };
    }
    else {
      throw new errors.DomainValidationError('InvalidStreet', streetPart);
    }
  }

  static async addressStringToBuildingObject(addressString) {
    await this.validateAddress(addressString);
    const addrParts = addressString.split(',').map((part) => part.trim());
    const streetAndHouseObj = this.parseStreetAndHouseNumber(addrParts[0]);
    const cityObj = await this.parseCity(addrParts[1]);
    const geocode = await this.getGooglePlacesGeocode(addressString);

    return Object.assign(streetAndHouseObj, cityObj, {
      geolocation: {
        type: 'Point',
        coordinates: [geocode.lng, geocode.lat]
      }
    });
  }
}

module.exports = AddressUtils;
