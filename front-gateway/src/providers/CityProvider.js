/**
 * City provider communicates with the Apartments API to get city meta data
 */
'use strict';

const getCitiesQuery = `
  query GetCities {
    cities {
      id
      city_name
      display_order
    }
  }
`;

class CityProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.isLoadingCities = false;
  }

  loadCities() {
    return this.apiProvider.gql(getCitiesQuery).then(({ data }) => this.appStore.cityStore.cities = data.cities);
  }
}

module.exports = CityProvider;
