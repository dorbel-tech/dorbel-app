'use strict';

class RelatedListingsProvider {
  constructor(apiProvider) {
    this.apiProvider = apiProvider;
  }

  get(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/related/'+listingId)
      .then(this.appStore.relatedListingsStore.add);
  }
}

module.exports = RelatedListingsProvider;
