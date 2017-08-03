/**
 * Neighborhood provider communicates with the Apartments API to get neighborhood meta data
 */
'use strict';

const neighborhoodQuery = `
  query NeighborhoodQuery($city_id: Int!) {
    neighborhoods(city_id: $city_id) {
      id
      neighborhood_name
      display_order
    }
  }
`;

class NeighborhoodProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.currentlyGetting = {};
  }

  loadNeighborhoodByCityId(city_id) {
    return this.apiProvider.gql(neighborhoodQuery, { city_id })
      .then(({ data }) => this.appStore.neighborhoodStore.neighborhoodsByCityId.set(city_id, data.neighborhoods));
  }
}

module.exports = NeighborhoodProvider;
