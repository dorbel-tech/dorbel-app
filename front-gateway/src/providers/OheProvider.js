/**
 * Open House Events Provider communicates with the OHE API
 */
'use strict';
import moment from 'moment';
import _ from 'lodash';
import autobind from 'react-autobind';

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';

class OheProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    autobind(this);
  }

  fetch(path, options) {
    return this.apiProvider.fetch('/api/ohe/v1/' + path, options);
  }

  // Open house events

  loadListingEvents(id) {
    return this.fetch('events/by-listing/' + id)
      .then(this.updateStoreWithOhe);
  }

  createOhe(data) {
    return this.fetch('event', {
      method: 'POST',
      data
    })
    .then(this.updateStoreWithOhe);
  }

  updateOhe(id, data) {
    return this.fetch('event/' + id, {
      method: 'PUT',
      data
    })
    .then(updatedOhe => {
      const oheInStore = this.appStore.oheStore.oheById.get(id);
      Object.assign(oheInStore, data);
      if (updatedOhe.registrations.length === 0) {
        // registrations might be reset
        oheInStore.registrations = [];
      }
      this.updateStoreWithOhe(oheInStore);
    });
  }

  updateStoreWithOhe(ohe) {
    let oheArray = _.isArray(ohe) ? ohe : [ohe];
    return this.appStore.oheStore.add(oheArray.map(this.enrichOhe));
  }

  enrichOhe(openHouseEvent) {
    // Parse utc but use local time after that
    const start = moment.utc(openHouseEvent.start_time).local();
    const end = moment.utc(openHouseEvent.end_time).local();

    openHouseEvent.timeLabel = `${start.format(timeFormat)} - ${end.format(timeFormat)}`;
    openHouseEvent.dateLabel = start.format(dateFormat);

    return openHouseEvent;
  }

  // Registrations

  registerForEvent(event, user) {
    return this.fetch('event/registration', {
      method: 'POST',
      data : {
        open_house_event_id: event.id,
        user_details: user
      }
    })
    .then(registration => {
      const ohe = this.appStore.oheStore.oheById.get(event.id);
      ohe.usersOwnRegistration = registration;
    });
  }

  unregisterForEvent(registration) {
    return this.fetch('event/registration/' + registration.id, {
      method: 'DELETE'
    })
    .then(() => {
      const ohe = this.appStore.oheStore.oheById.get(registration.open_house_event_id);
      ohe.usersOwnRegistration = undefined;      
    });
  }
  
  // Follow listing

  getFollowsForListing(listing_id) {
    return this.fetch('followers/by-listing/' + listing_id)
    .then(followers => {
      let usersFollowDetails = null;
      
      if (this.appStore.authStore.isLoggedIn) {
        const user = this.appStore.authStore.getProfile();
        usersFollowDetails = _.find(followers, { following_user_id: user.dorbel_user_id });       
      }

      this.appStore.oheStore.usersFollowsByListingId.set(listing_id, usersFollowDetails);        
    });
  }

  follow(listing, user) {
    return this.fetch('follower', {
      method: 'POST',
      data : {
        listing_id: listing.id,
        user_details: user
      }
    })
    .then(followDetails => this.appStore.oheStore.usersFollowsByListingId.set(listing.id, followDetails));
  }

  unfollow(followDetails) {
    return this.fetch('follower/' + followDetails.id, {
      method: 'DELETE'
    })
    .then(() => this.appStore.oheStore.usersFollowsByListingId.set(followDetails.listing_id, null));    
  }
}

module.exports = OheProvider;
