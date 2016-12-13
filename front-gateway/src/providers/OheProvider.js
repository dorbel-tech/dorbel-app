/**
 * Open House Events Provider communicates with the OHE API
 */
'use strict';
import { action } from 'mobx';

class OheProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  loadListingEvents(id) {    
    return this.apiProvider.fetch('/api/ohe/v1/events/by-listing/' + id)
      .then(action('load-listing-events', openHouseEvents => this.appStore.oheStore.oheByListingId.set(id, openHouseEvents)));
  }
}

module.exports = OheProvider;
