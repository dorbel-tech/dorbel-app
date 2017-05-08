/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';
import { isMobile } from './utils';

const PAGE_SIZE = isMobile() ? 9 : 15;

class SearchProvider {
  constructor(appStore, appProviders) {
    this.appStore = appStore;
    this.apiProvider = appProviders.api;
    this.oheProvider = appProviders.ohe;
  }

  search(query, loadNextPage) {
    const searchStore = this.appStore.searchStore;
    if (searchStore.isLoadingNewSearch || searchStore.isLoadingNextPage) {
      return Promise.resolve();
    }

    this.appStore.query = query;

    // const q = encodeURIComponent();
    const params = {
      q: JSON.stringify(query || {}),
      limit: PAGE_SIZE
    };

    if (!loadNextPage) { // new search
      searchStore.reset();
      searchStore.isLoadingNewSearch = true;
    } else { // next page
      searchStore.isLoadingNextPage = true;
      params.offset = searchStore.length;
    }

    return this.apiProvider.fetch('/api/apartments/v1/listings', { params })
      .then((results) => {
        searchStore.searchError = false;
        searchStore.add(results);
        searchStore.isLoadingNewSearch = false;
        searchStore.isLoadingNextPage = false;
        searchStore.hasMorePages = (results.length === PAGE_SIZE);

        const listingIds = results.map(listing => listing.id);
        this.oheProvider.loadListingEvents(listingIds);
        return results;
      })
      .catch(() => {
        searchStore.reset();
        searchStore.searchError = true;
      });
  }

  loadNextPage() {
    return this.search(this.appStore.query, true);
  }

  getRelatedListings(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId + '/related/');
  }

  setLastScrollTop(scrollTop) {
    this.lastPathname = location.pathname;
    this.appStore.searchStore.lastScrollTop = scrollTop;
  }

  getLastScrollTop() {
    if (this.lastPathname !== location.pathname) {
      return 0;
    }
    return this.appStore.searchStore.lastScrollTop;
  }
}

module.exports = SearchProvider;
