/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';

class SearchProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  initFilter() {
    this.appStore.searchStore.filterChanged = false;
  }

  search(query) {
    this.appStore.searchStore.isLoading = true;
    this.appStore.searchStore.filterChanged = true;

    const q = encodeURIComponent(JSON.stringify(query || {}));
    return this.apiProvider.fetch('/api/apartments/v1/listings?q=' + q)
      .then((results) => {
        this.appStore.searchStore.searchResults = results;
        this.appStore.searchStore.isLoading = false;
      });
  }

  getRelatedListings(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId + '/related/');
  }
}

module.exports = SearchProvider;
