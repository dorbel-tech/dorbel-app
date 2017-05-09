/** 
 * This module provides data retrieval functions needed by the notification-sender 
 * To fetch the different data needed by each notification type before it is sent 
 */ 
'use strict'; 
const _ = require('lodash');
const request = require('request-promise'); 
const shared = require('dorbel-shared');
const userManagement = shared.utils.user.management;
const APT_API = process.env.APARTMENTS_API_URL;
const OHE_API = process.env.OHE_API_URL;

// Creating special notification service dummy user to handle data retrival from service in order to pass user validation checks.
const notificationServiceUser = { id: '10000000-0000-0000-0000-000000000000', role: 'admin' };
const requestOptions = { headers: { 'x-user-profile': JSON.stringify(notificationServiceUser) }, json: true };

if (!APT_API || !OHE_API) {
  throw new Error('Missing API Urls in config');
}

function getListingInfo(listingId) {
  return request.get(`${APT_API}/v1/listings/${listingId}`, requestOptions);
}

function getOheInfo(oheId) {
  return request.get(`${OHE_API}/v1/event/${oheId}`, requestOptions);
}

function getListingFollowers(listingId) {
  return request.get(`${OHE_API}/v1/followers/by-listing/${listingId}`, requestOptions);
}

function getListingOhes(listingId) {
  return request.get(`${OHE_API}/v1/events/by-listing/${listingId}`, requestOptions);
}

function getOheRegisteredUsers(oheId) {
  return getOheInfo(oheId)
    .then(response => {
      // this notification will be sent to the users registered to the OHE
      return {
        customRecipients: response.registrations
          .filter(registration => registration.is_active)
          .map(registration => registration.registered_user_id)
      };
    });  
}

const dataRetrievalFunctions = { 
  getListingInfo: eventData => {
    return getListingInfo(eventData.listing_id)
      .then(listing => {
        return userManagement.getUserDetails(listing.publishing_user_id)
          .then(listingUser => {
            listing.publishing_user_email = _.get(listingUser, 'user_metadata.email') || listingUser.email;
            listing.publishing_user_phone = _.get(listingUser, 'user_metadata.phone') || listingUser.phone;
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
          customRecipients: [response.publishing_user_id]
        };
      });
  },
  sendToOheRegisteredUsers: eventData => {
    return getOheRegisteredUsers(eventData.event_id);
  },
  getListingOhesAndSendToOheRegisteredUsers: eventData => {
    return getListingOhes(eventData.listing_id)
      .then(response => {
        const getRegisteredUsersForAllOhes = response.map(ohe => getOheRegisteredUsers(ohe.id));

        return Promise.all(getRegisteredUsersForAllOhes)
          .then(results => {
            return {
              customRecipients: _.uniq(_.flatten(_.map(results, 'customRecipients')))
            };
          });
      });
  }, 
  getListingOhesCount: eventData => {
    return getListingOhes(eventData.listing_id)
      .then(response => ({ ohesCount: response.length || 0 }));
  },
  getListingFollowersCount: eventData => {
    return getListingFollowers(eventData.listing_id)
      .then(followers => { 
        return getListingInfo(eventData.listing_id)
        .then(listing => {
          return {
            customRecipients: [ listing.publishing_user_id ],          
            followersCount: followers.length 
          };
        });
      });
  },
  sendToListingFollowers: eventData => {
    return getListingFollowers(eventData.listing_id)
      .then(response => {
        // this notification will be sent to all the users who followed a listing
        return {
          customRecipients: response
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
