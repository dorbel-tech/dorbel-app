/** 
 * This module provides data retrivel functions needed by the notification-sender 
 * To fetch the different data needed by each notification type before it is sent 
 */ 
'use strict'; 
const request = require('request-promise'); 
const shared = require('dorbel-shared');

const APT_API = shared.config.get('APARTMENTS_API_URL');
const OHE_API = shared.config.get('OHE_API_URL');

if (!APT_API || !OHE_API) {
  throw new Error('Missing API Urls in config');
}

function getOheInfo(oheId) {
  return request.get(`${OHE_API}/v1/event/${oheId}`, { json: true });
}

const dataRetrievalFunctions = { 
  getListingFollowers: eventData => {
    return request.get(`${OHE_API}/v1/followers/by-listing/${eventData.listing_id}`, { json: true })
    .then(response => ({ 
      customRecipients: response.followers
        .filter(follower => follower.is_active)
        .map(follower => follower.following_user_id) 
    }));
  },
  getListingInfo: eventData => {
    return request.get(`${APT_API}/v1/listings/${eventData.listing_id}`, { json: true })
    .then(response => ({ listing : response }));
  },
  getOheInfo: eventData => {
    return getOheInfo(eventData.event_id)
    .then(reponse => ({ ohe: reponse }));
  },
  getOheRegisteredUsers: eventData => {
    return getOheInfo(eventData.event_id)
    .then(reponse => ({
      // this notification will be sent to the users registered to the OHE 
      customRecipients: reponse.registrations
        .filter(registration => registration.is_active)
        .map(registration => registration.registered_user_id) 
    }));
  }
}; 
 
function getAdditonalData(eventConfig, eventData) {
  const dataRequired = eventConfig.dataRetrieval || []; 
  return Promise.all( 
    dataRequired 
    .filter(retrivelFunctionName => dataRetrievalFunctions[retrivelFunctionName]) // only take ones that actually exist 
    .map(retrivelFunctionName => dataRetrievalFunctions[retrivelFunctionName](eventData)) // run the functions 
  ) 
  .then(results => { 
    // all results are returned as one object, duplicate keys will be prioritizing according to the order in eventConfig.dataRetrieval  
    return results.reduce((prev, current) => Object.assign(prev, current), {}); 
  }); 
} 

module.exports = {
  getAdditonalData
};
