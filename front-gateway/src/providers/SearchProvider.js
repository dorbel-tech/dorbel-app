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
    this.appStore.query = query;

    const q = encodeURIComponent(JSON.stringify(query || {}));
    const params = {
      q,
      limit: 25 // TODO : make dynamic for mobile
    };

    return this.apiProvider.fetch('/api/apartments/v1/listings', { params })
      .then((results) => {
        this.appStore.searchStore.searchResults = results;
        this.appStore.searchStore.isLoading = false;
        return results;
      });
  }

  loadNextPage() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    const query = this.appStore.query;

    const q = encodeURIComponent(JSON.stringify(query || {}));
    const params = {
      q,
      limit: 25 ,// TODO : make dynamic for mobile
      offset: this.appStore.searchStore.searchResults.length
    };

    return this.apiProvider.fetch('/api/apartments/v1/listings', { params })
      .then((results) => {
        const store = this.appStore.searchStore.searchResults;
        store.push.apply(store, results);
        this.isLoading = false;
      });
  }

  getRelatedListings(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId + '/related/');
  }
}

module.exports = SearchProvider;
