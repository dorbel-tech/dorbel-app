/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';
import { isMobile } from './utils';

const PAGE_SIZE = isMobile() ? 8 : 25;

class SearchProvider {
  constructor(appStore, appProviders) {
    this.appStore = appStore;
    this.apiProvider = appProviders.api;
    this.oheProvider = appProviders.ohe;
  }

  search(query, loadNextPage) {
    const searchStore = this.appStore.searchStore;
    this.appStore.query = query;

    // const q = encodeURIComponent();
    const params = {
      q: JSON.stringify(query || {}),
      limit: PAGE_SIZE
    };

    if (!loadNextPage) { // new search
      searchStore.reset();
    } else { // next page
      params.offset = searchStore.length;
    }

    return this.apiProvider.fetch('/api/apartments/v1/listings', { params })
      .then((results) => {
        searchStore.add(results);
        searchStore.isLoading = false;
        searchStore.hasMorePages = (results.length === PAGE_SIZE);

        const listingIds = results.map(listing => listing.id);
        this.oheProvider.loadListingEvents(listingIds);
        return results;
      })
      .catch(() => {
        // reset query ?
        searchStore.reset();
      });
  }

  loadNextPage() {
    return this.search(this.appStore.query, true);
  }

  getRelatedListings(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId + '/related/');
  }
}

module.exports = SearchProvider;
