/**
 * SearchProvider communicates with the Apartments API (Future search API?)
 */
'use strict';
import _ from 'lodash';
import { isMobile, asPromise } from './utils';
import { fieldSets } from '~/graphql';

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

  saveFilter(filter) {
    const { searchStore } = this.appStore;
    filter = _.pick(filter, fieldSets.filterFields);
    if (filter.neighborhood === '*') {
      filter.neighborhood = undefined;
    }

    if (searchStore.activeFilterId) { // filter is not new
      filter.id = searchStore.activeFilterId;
    }

    return asPromise(() => this.validateFilter(filter))
    .then(() => this.apiProvider.mutate(`
      mutation saveFilter($filter: FilterInput!) {
        upsertFilter(filter: $filter) {
          ${fieldSets.filterFields.join(', ')}
        }
      }`, { filter }))
    .then(({ data }) => searchStore.activeFilterId = data.upsertFilter.id);
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
