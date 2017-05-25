/**
 * Open House Events Provider communicates with the OHE API
 */
'use strict';
import _ from 'lodash';
import autobind from 'react-autobind';
import utils from './utils';

const LOAD_LISTING_EVENTS_BATCH_SIZE = 5;

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
  loadListingEvents(listing_ids) {
    if (!listing_ids) {
      return Promise.resolve();
    }
    const { oheStore } = this.appStore;

    listing_ids = _.isArray(listing_ids) ? listing_ids : [listing_ids];
    listing_ids = listing_ids.filter(id => !oheStore.isListingLoaded(id));

    if (listing_ids.length === 0) {
      return Promise.resolve();
    } else if (listing_ids.length > LOAD_LISTING_EVENTS_BATCH_SIZE) {
      const chunks = _.chunk(listing_ids, LOAD_LISTING_EVENTS_BATCH_SIZE);
      const functionsThatLoadEachChunk = chunks.map(chunk => {
        return () => this.loadListingEvents(chunk);
      });

      return utils.promiseSeries(functionsThatLoadEachChunk);
    } else {
      const fetchOptions = {};

      return this.fetch('events/by-listing/' + listing_ids.join(','), fetchOptions)
      .then((ohes) => {
        this.updateStoreWithOhe(ohes);
        // we want this to be done even if the listing has no OHEs - so we can indicate the listing has no OHEs
        oheStore.markListingsAsLoaded(listing_ids);
      });
    }
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
    return this.appStore.oheStore.add(oheArray);
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
        window.analytics.track('client_ohe_registered', { user_id: user.user_id }); // For Facebook conversion tracking.
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
  getFollowsForListing(listing_id, include_profile=false) {
    return this.fetch('followers/by-listing/' + listing_id + '?include_profile=' + include_profile)
    .then(followers => {
      if (include_profile) {
        this.appStore.oheStore.followersByListingId.set(listing_id, followers);
      }

      this.appStore.oheStore.countFollowersByListingId.set(listing_id, followers.length);
      let usersFollowDetails = null;

      if (this.appStore.authStore.isLoggedIn) {
        const profile = this.appStore.authStore.profile;
        usersFollowDetails = _.find(followers, { following_user_id: profile.dorbel_user_id });
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
    .then(followDetails => {
      this.updateStoreWithFollow(listing.id, followDetails);
    })
    .then(() => {
      window.analytics.track('client_listing_follow', { user_id: user.user_id }); // For Facebook conversion tracking.
    });
  }

  unfollow(followDetails) {
    return this.fetch('follower/' + followDetails.id, {
      method: 'DELETE'
    })
    .then(() => {
      this.updateStoreWithFollow(followDetails.listing_id, null);
    });
  }

  updateStoreWithFollow(listingId, followDetails) {
    const followersCount = this.appStore.oheStore.countFollowersByListingId.get(listingId);
    const delta = followDetails ? 1 : -1; // Increase or decrease followers count.
    this.appStore.oheStore.usersFollowsByListingId.set(listingId, followDetails);
    this.appStore.oheStore.countFollowersByListingId.set(listingId, followersCount + delta);
  }
}

module.exports = OheProvider;
