'use strict';

class RelatedListingsProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  getRelatedListings(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/related/'+listingId)
      .then(listings => this.appStore.relatedListingsStore.add(listings));
  }
}

module.exports = RelatedListingsProvider;
