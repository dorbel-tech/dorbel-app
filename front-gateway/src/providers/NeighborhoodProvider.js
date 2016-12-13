/**
 * Neighborhood provider communicates with the Apartments API to get neighborhood meta data
 */
'use strict';
import { action } from 'mobx';

class NeighborhoodProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  loadNeighborhoodByCityId(id) {
    return this.apiProvider.fetch('/api/apartments/v1/neighborhoods/' + id)
      .then(action(neighborhoods => this.appStore.neighborhoodStore.neighborhoods = neighborhoods));
  }
}

module.exports = NeighborhoodProvider;
