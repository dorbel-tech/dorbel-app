/**
 * City provider communicates with the Apartments API to get city meta data
 */
'use strict';
import { action } from 'mobx';

class CityProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  loadCities() {
    return this.apiProvider.fetch('/api/apartments/v1/cities')
      .then(action(cities => this.appStore.cityStore.cities = cities));
  }
}

module.exports = CityProvider;
