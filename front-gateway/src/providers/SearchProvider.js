/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';
import _ from 'lodash';
import { isMobile } from './utils';

const PAGE_SIZE = isMobile() ? 9 : 15;
const FILTERS_URL = '/api/apartments/v1/filters';

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
      // Check if the store should be reset
      if (params.q !== this.lastQ) {
        searchStore.reset();
        this.lastQ = params.q;
      }
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

  setLastScrollTop(scrollTop, scrollKey) {
    this.lastScrollKey = scrollKey;
    this.appStore.searchStore.lastScrollTop = scrollTop;
  }

  getLastScrollTop(scrollKey) {
    if (this.lastScrollKey !== scrollKey) {
      return 0;
    }

    return this.appStore.searchStore.lastScrollTop;
  }

  loadSavedFilters() {
    return this.apiProvider.fetch(FILTERS_URL)
    .then(filters => {
      filters.forEach(filter => this.appStore.searchStore.filters.set(filter.id, filter));
    });
  }

  saveFilter(filter) {
    filter = _.cloneDeep(filter);
    if (filter.neighborhood === '*') {
      filter.neighborhood = undefined;
    }

    let url = FILTERS_URL;
    let method = 'POST';

    if (filter.id) { // filter is not new
      url += '/' + filter.id;
      method = 'PUT';
    }

    return this.apiProvider.fetch(url, { method, data: filter })
    .then(updatedFilter => this.appStore.searchStore.filters.set(updatedFilter.id, updatedFilter));
  }
}

module.exports = SearchProvider;
