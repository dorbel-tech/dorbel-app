/**
 * City provider communicates with the Apartments API to get city meta data
 */
'use strict';

class CityProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  loadCities() {
    const { cities } = this.appStore.cityStore;
    return new Promise((resolve) => {
      if (cities.length > 0) {
        resolve();
      }
      else {
        this.apiProvider.fetch('/api/apartments/v1/cities')
          .then((citiesResp) => {
            this.appStore.cityStore.cities = citiesResp;
            resolve();
          });
      }
    });
  }
}

module.exports = CityProvider;
