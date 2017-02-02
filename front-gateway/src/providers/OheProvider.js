/**
 * Open House Events Provider communicates with the OHE API
 */
'use strict';
import _ from 'lodash';
import autobind from 'react-autobind';
import utils from './utils';

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
      .then((ohes) => this.updateStoreWithOhe(ohes));
  }

  createOhe(data) {
    return this.fetch('event', {
      method: 'POST',
      data
    })
    .then((ohe) => {
      // Added in order to resolve a bug in which EditOHEModal is rendered unnecessary and throws an error about registrations being undefined
      ohe.registrations = [];
      this.updateStoreWithOhe(ohe);
    });
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

  deleteOhe(id) {
    return this.fetch('event/' + id, { method: 'DELETE' })
    .then(() => {
      this.appStore.oheStore.oheById.delete(id);
    });
  }

  updateStoreWithOhe(ohe) {
    let oheArray = _.isArray(ohe) ? ohe : [ohe];
    return this.appStore.oheStore.add(oheArray.map(this.enrichOhe));
  }

  enrichOhe(openHouseEvent) {
    openHouseEvent.timeLabel = `${utils.formatTime(openHouseEvent.end_time)} - ${utils.formatTime(openHouseEvent.start_time)}`;
    openHouseEvent.dateLabel = utils.formatDate(openHouseEvent.start_time);

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
      .then(() => {
        this.appStore.authStore.updateProfile({
          first_name: user.firstname,
          phone: user.phone,
          email: user.email
        });
        event.status = 'registered';
      });
  }

  unregisterForEvent(event) {
    return this.fetch('event/registration/' + event.id, {
      method: 'DELETE'
    })
      .then(() => {
        event.status = 'open';
      });
  }

  // Follow listing

  getFollowsForListing(listing_id) {
    return this.fetch('followers/by-listing/' + listing_id)
    .then(followers => {
      let usersFollowDetails = null;

      if (this.appStore.authStore.isLoggedIn) {
        const user = this.appStore.authStore.profile;
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
    .then(followDetails => this.appStore.oheStore.usersFollowsByListingId.set(listing.id, followDetails))
    .then(this.appStore.authStore.updateProfile({ email: user.email }));
  }

  unfollow(followDetails) {
    return this.fetch('follower/' + followDetails.id, {
      method: 'DELETE'
    })
    .then(() => this.appStore.oheStore.usersFollowsByListingId.set(followDetails.listing_id, null));
  }
}

module.exports = OheProvider;
