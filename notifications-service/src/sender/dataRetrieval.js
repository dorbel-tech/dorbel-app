/**
 * This module provides data retrieval functions needed by the notification-sender
 * To fetch the different data needed by each notification type before it is sent
 */
'use strict';
const _ = require('lodash');
const request = require('request-promise');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const userManagement = shared.utils.user.management;
const APT_API = process.env.APARTMENTS_API_URL;

// Creating special notification service dummy user to handle data retrival from service in order to pass user validation checks.
const notificationServiceUser = { id: '10000000-0000-0000-0000-000000000000', role: 'admin' };
const requestOptions = { headers: { 'x-user-profile': JSON.stringify(notificationServiceUser) }, json: true };

if (!APT_API) {
  throw new Error('Missing API Urls in config');
}

function getListingInfo(listingId) {
  return request.get(`${APT_API}/v1/listings/${listingId}`, requestOptions);
}

function getApartmentLikes(apartmentId) {
  return request.get(`${APT_API}/v1/apartments/${apartmentId}/likes`, requestOptions);
}

function getMatchingFiltersByListingId(listingId) {
  return request.get(`${APT_API}/v1/filters?matchingListingId=${listingId}`, requestOptions);
}

const dataRetrievalFunctions = {
  getListingInfo: eventData => {
    return getListingInfo(eventData.listing_id)
      .then(listing => {
        return userManagement.getUserDetails(listing.publishing_user_id)
          .then(listingUser => {
            if (listingUser) {
              listing.publishing_user_email = _.get(listingUser, 'user_metadata.email') || listingUser.email;
              listing.publishing_user_phone = _.get(listingUser, 'user_metadata.phone') || listingUser.phone;
            }
            // Reducing object size by removing unused data.
            listing.apartment.building.geolocation = undefined;
            listing.meta = undefined;
            listing.thumbnailImageUrl = _.get(listing, 'images[0].url');
            listing.images = undefined;
            return { listing };
          });
      });
  },
  getApartmentLikesCount: eventData => {
    return getApartmentLikes(eventData.apartment_id)
      .then(likes => {
        return getListingInfo(eventData.listing_id)
        .then(listing => {
          return {
            customRecipients: [ listing.publishing_user_id ],
            followersCount: likes.length
          };
        });
      });
  },
  sendToApartmentLikedUsers: eventData => {
    return getApartmentLikes(eventData.apartment_id)
      .then(response => {
        // this notification will be sent to all the users who liked an apartment
        return {
          customRecipients: response
            .filter(like => like.is_active)
            .map(like => like.liked_user_id)
        };
      });
  },
  getUserDetails: eventData => {
    return userManagement.getPublicProfile(eventData.user_uuid)
      .then(userProfile => {
        return { user_profile: userProfile };
      });
  },
  getMatchingFilters: eventData => {
    return getMatchingFiltersByListingId(eventData.listing_id)
      .then(matchingFilters => {
        return {
          customRecipients: _.uniq(_.map(matchingFilters, 'dorbel_user_id'))
        };
      });
  }
};

function runRetrievalFunction(retrievalFunctionName, eventData) {
  return dataRetrievalFunctions[retrievalFunctionName](eventData)
  .catch(err => {
    logger.error({ err, retrievalFunctionName, eventData }, 'failed in data retrieval');
    throw err;
  });
}

function getAdditonalData(eventConfig, eventData) {
  const dataRequired = eventConfig.dataRetrieval || [];
  return Promise.all(
    dataRequired
    .filter(retrievalFunctionName => dataRetrievalFunctions[retrievalFunctionName]) // only take ones that actually exist
    .map(retrievalFunctionName => runRetrievalFunction(retrievalFunctionName, eventData))
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
