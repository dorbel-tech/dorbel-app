/**
 * Neighborhood provider communicates with the Apartments API to get neighborhood meta data
 */
'use strict';

class NeighborhoodProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  loadNeighborhoodByCityId(id) {
    return new Promise((resolve) => {
      const { neighborhoodsByCityId } = this.appStore.neighborhoodStore;
      if (neighborhoodsByCityId.get(id) != undefined) {
        resolve();
      }
      else {
        this.apiProvider.fetch('/api/apartments/v1/neighborhoods/' + id)
          .then((neighborhoods) => {
            this.appStore.neighborhoodStore.neighborhoodsByCityId.set(id, neighborhoods);
            resolve();
          });
      }
    });
  }
}

module.exports = NeighborhoodProvider;
