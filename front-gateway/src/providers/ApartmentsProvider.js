/**
 * ApartmentsProvider communicates with the Apartments API
 */
'use strict';
import { action } from 'mobx';

class ApartmentsProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  @action
  loadApartments() {
    return this.apiProvider.fetch('/api/v1/apartments')
      .then(apartments => this.appStore.apartmentStore.apartments = apartments);
  }
}

module.exports = ApartmentsProvider;
