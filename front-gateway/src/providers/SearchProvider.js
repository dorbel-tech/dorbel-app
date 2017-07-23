/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';
import _ from 'lodash';
import { isMobile, asPromise } from './utils';

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

  getRelatedListings(apartmentId) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + apartmentId + '/related/');
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
    const { searchStore } = this.appStore;
    filter = _.cloneDeep(filter);
    if (filter.neighborhood === '*') {
      filter.neighborhood = undefined;
    }

    let url = FILTERS_URL;
    let method = 'POST';

    if (searchStore.activeFilterId) { // filter is not new
      url += '/' + searchStore.activeFilterId;
      method = 'PUT';
      if (!filter.hasOwnProperty('email_notification')) { // if email_notification is not set we keep current value
        filter.email_notification = searchStore.filters.get(searchStore.activeFilterId).email_notification;
      }
    }

    return asPromise(() => this.validateFilter(filter))
    .then(() => this.apiProvider.fetch(url, { method, data: filter }))
    .then(updatedFilter => {
      searchStore.filters.set(updatedFilter.id, updatedFilter);
      searchStore.activeFilterId = updatedFilter.id;
    });
  }

  resetActiveFilter() {
    this.appStore.searchStore.activeFilterId = null;
  }

  validateFilter(filter) {
    if (!filter.city ||
        !(filter.mrs || filter.mre) ||
        !(filter.minRooms || filter.maxRooms)) {
      throw new Error('על מנת לשמור חיפוש - יש לבחור עיר, מספר חדרים ומחיר');
    }
  }
}

module.exports = SearchProvider;
