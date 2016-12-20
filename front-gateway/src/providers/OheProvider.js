/**
 * Open House Events Provider communicates with the OHE API
 */
'use strict';
import moment from 'moment';
import _ from 'lodash';

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';

class OheProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.enrichOhe = this.enrichOhe.bind(this);
  }

  // Open house events

  loadListingEvents(id) {    
    return this.apiProvider.fetch('/api/ohe/v1/events/by-listing/' + id)
      .then(openHouseEvents => openHouseEvents.map(this.enrichOhe))
      .then(openHouseEvents => this.appStore.oheStore.add(openHouseEvents));
  }

  registerForEvent(event) {
    return this.apiProvider.fetch('/api/ohe/v1/event/registration', {
      method: 'POST',
      data : {
        open_house_event_id: event.id
      }
    })
    .then(registration => {
      const ohe = this.appStore.oheStore.oheById.get(event.id);
      ohe.registrations.push(registration);
      this.setUsersOwnRegistration(ohe);
    });
  }

  unregisterForEvent(registration) {
    return this.apiProvider.fetch('/api/ohe/v1/event/registration/' + registration.id, {
      method: 'DELETE'
    })
    .then(() => {
      const ohe = this.appStore.oheStore.oheById.get(registration.open_house_event_id);
      ohe.registrations.remove(registration);
      this.setUsersOwnRegistration(ohe);
    });
  }

  enrichOhe(openHouseEvent) {
    const start = moment(openHouseEvent.start_time);
    const end = moment(openHouseEvent.end_time);

    openHouseEvent.timeLabel = `${start.format(timeFormat)} - ${end.format(timeFormat)}`;
    openHouseEvent.dateLabel = start.format(dateFormat);

    this.setUsersOwnRegistration(openHouseEvent);

    return openHouseEvent;
  }

  setUsersOwnRegistration(openHouseEvent) {
    if (this.appStore.authStore.isLoggedIn) {
      const user = this.appStore.authStore.getProfile();
      openHouseEvent.usersOwnRegistration = _.find(openHouseEvent.registrations, { registered_user_id: user.dorbel_user_id });
    }
  }

  // Follow listing

  getFollowsForListing(listing) {
    return this.apiProvider.fetch('/api/ohe/v1/followers/by-listing/' + listing.id)
    .then(followers => {
      let usersFollowDetails = null;
      
      if (this.appStore.authStore.isLoggedIn) {
        const user = this.appStore.authStore.getProfile();
        usersFollowDetails = _.find(followers, { following_user_id: user.dorbel_user_id });       
      }

      this.appStore.oheStore.usersFollowsByListingId.set(listing.id, usersFollowDetails);        
    });
  }

  follow(listing) {
    return this.apiProvider.fetch('/api/ohe/v1/follower', {
      method: 'POST',
      data : {
        listing_id: listing.id
      }
    })
    .then(followDetails => this.appStore.oheStore.usersFollowsByListingId.set(listing.id, followDetails));
  }

  unfollow(followDetails) {
    return this.apiProvider.fetch('/api/ohe/v1/follower/' + followDetails.id, {
      method: 'DELETE'
    })
    .then(() => this.appStore.oheStore.usersFollowsByListingId.set(followDetails.listing_id, null));    
  }
}

module.exports = OheProvider;
