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
      .then(action('load-listing-events', openHouseEvents => this.appStore.oheStore.add(openHouseEvents)));
  }

  registerForEvent(event) {
    return this.apiProvider.fetch('/api/ohe/v1/event/registration', {
      method: 'POST',
      data : {
        open_house_event_id: event.id
      }
    })
    .then(registration => {
      this.appStore.oheStore.oheById.get(event.id).registrations.push(registration);
    });
  }

  unregisterForEvent(registration) {
    return this.apiProvider.fetch('/api/ohe/v1/event/registration/' + registration.id, {
      method: 'DELETE'
    })
    .then(() => {
      const event = this.appStore.oheStore.oheById.get(registration.open_house_event_id);
      event.registrations.remove(registration);
    });
  }
}

module.exports = OheProvider;
