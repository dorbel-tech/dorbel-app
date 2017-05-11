/**
 * Neighborhood provider communicates with the Apartments API to get neighborhood meta data
 */
'use strict';

class NeighborhoodProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.currentlyGetting = {};
  }

  loadNeighborhoodByCityId(id) {
    return new Promise((resolve, reject) => {
      const { neighborhoodsByCityId } = this.appStore.neighborhoodStore;
      if (!neighborhoodsByCityId.get(id) && !this.currentlyGetting[id]) {
        this.currentlyGetting[id] = true;
        return this.apiProvider.fetch('/api/apartments/v1/neighborhoods/' + id)
          .then((neighborhoods) => {
            this.appStore.neighborhoodStore.neighborhoodsByCityId.set(id, neighborhoods);
            resolve();
          })
          .catch(reject)
          .then(() => { delete this.currentlyGetting[id]; });
      }
      else {
        resolve();
      }
    });

  }
}

module.exports = NeighborhoodProvider;
