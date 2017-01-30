/** 
 * This module provides data retrieval functions needed by the notification-sender 
 * To fetch the different data needed by each notification type before it is sent 
 */ 
'use strict'; 
const _ = require('lodash');
const request = require('request-promise'); 
const shared = require('dorbel-shared');
const userManagement = shared.utils.userManagement;
const APT_API = shared.config.get('APARTMENTS_API_URL');
const OHE_API = shared.config.get('OHE_API_URL');

// Creating special notification service dummy user to handle data retrival from service in order to pass user validation checks.
const notificationServiceUser = { id: '10000000-0000-0000-0000-000000000000', role: 'admin' };
const requestObject = { headers: { 'x-user-profile': JSON.stringify(notificationServiceUser) }, json: true };

if (!APT_API || !OHE_API) {
  throw new Error('Missing API Urls in config');
}

function getOheInfo(oheId) {
  return request.get(`${OHE_API}/v1/event/${oheId}`, requestObject);
}

function getListingFollowers(listingId) {
  return request.get(`${OHE_API}/v1/followers/by-listing/${listingId}`, requestObject);
}

const dataRetrievalFunctions = { 
  getListingInfo: eventData => {
    return userManagement.getUserDetails(eventData.user_uuid)
      .then(publishingUser => {
        let user = { id: eventData.user_uuid, role: publishingUser.role };
        return request.get(`${APT_API}/v1/listings/${eventData.listing_id}`, requestObject)
          .then(listing => {
            listing.publishing_user_email = _.get(publishingUser, 'user_metadata.email') || publishingUser.email;
            // Reducing object size by removing unused data.
            listing.apartment.building.neighborhood = undefined;
            listing.images = undefined;
            return { listing };        
          });
      });
  },
  getOheInfo: eventData => {
    return getOheInfo(eventData.event_id)
    .then(response => ({ ohe: response }));
  },
  getOheInfoForLandlord: eventData => {
    return getOheInfo(eventData.event_id)
    .then(response => {
      // Manually adding registrationsCount to trigger email sending to apartment owner
      // only for the first registered user to OHE.
      response.registrationsCount = response.registrations.length;
      return {
        ohe: response,
        customRecipients: [ response.publishing_user_id ]
      };
    });
  },
  sendToOheRegisteredUsers: eventData => {
    return getOheInfo(eventData.event_id)
    .then(response => {
      // this notification will be sent to the users registered to the OHE
      return { customRecipients: response.registrations
        .filter(registration => registration.is_active)
        .map(registration => registration.registered_user_id)
      };
    });
  },
  getListingOhesCount: eventData => {
    return userManagement.getPublicProfile(eventData.user_uuid)
      .then(publicUser => {
        let user = { id: eventData.user_uuid, role: publicUser.role };
        return request.get(`${OHE_API}/v1/events/by-listing/${eventData.listing_id}`, requestObject)
          .then(response => ({ ohesCount: response.length || 0 }));
      });
  },
  getListingFollowersCount: eventData => {
    return getListingFollowers(eventData.listing_id)
      .then(followers => ({ followersCount: followers.length }));
  },
  sendToListingFollowers: eventData => {
    return getListingFollowers(eventData.listing_id)
    .then(response => { 
      // this notification will be sent to all the users who followed a listing to get notified on new OHE
      return { customRecipients: response
        .filter(follower => follower.is_active)
        .map(follower => follower.following_user_id)
      };
    });
  },
  getUserDetails: eventData => {
    return userManagement.getPublicProfile(eventData.user_uuid)
      .then(userProfile => ({ user_profile: userProfile }));
  }
};

function getAdditonalData(eventConfig, eventData) {
  const dataRequired = eventConfig.dataRetrieval || [];   
  return Promise.all( 
    dataRequired 
    .filter(retrievalFunctionName => dataRetrievalFunctions[retrievalFunctionName]) // only take ones that actually exist 
    .map(retrievalFunctionName => dataRetrievalFunctions[retrievalFunctionName](eventData)) // run the functions 
  ) 
  .then(results => { 
    // all results are returned as one object, duplicate keys will be removed
    // prioritizing according to the order in eventConfig.dataRetrieval  
    return results.reduce((prev, current) => Object.assign(prev, current), {}); 
  }); 
} 

module.exports = {
  getAdditonalData
};
