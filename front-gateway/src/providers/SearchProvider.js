/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';

class SearchProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  search(query) {
    const q = encodeURIComponent(JSON.stringify(query || {}));

    return this.apiProvider.fetch('/api/apartments/v1/listings?q=' + q)
      .then((results) => { this.appStore.searchStore.searchResults = results; });
  }

  getRelatedListings(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId + '/related/');
  }
}

module.exports = SearchProvider;
