/**
 * City provider communicates with the Apartments API to get city meta data
 */
'use strict';

class CityProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.isLoadingCities = false;
  }

  loadCities() {
    return new Promise((resolve, reject) => {
      let { cities } = this.appStore.cityStore;
      if (!cities.length) {
        this.isLoadingCities = true;
        this.apiProvider.fetch('/api/apartments/v1/cities')
          .then((citiesResp) => {
            this.appStore.cityStore.cities = citiesResp;
            this.isLoadingCities = false;
            resolve();
          })
          .catch(reject);
      }
      else { resolve(); }
    });
  }
}

module.exports = CityProvider;
