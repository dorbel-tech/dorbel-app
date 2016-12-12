/** 
 * This module provides data retrivel functions needed by the notification-sender 
 * To fetch the different data needed by each notification type before it is sent 
 */ 
'use strict'; 
const request = require('request-promise'); 
const shared = require('dorbel-shared');
 
const dataRetrievalFunctions = { 
  // 'getOheFollowers': (eventData) => {
  //   return { customRecipients : [...] };
  // },
  'getListingInfo': eventData => {
    const listing_id = eventData.listing_id;
    return request.get(`${shared.config.get('APARTMENTS_API_URL')}/v1/listings/${listing_id}`, { json: true })
    .then(response => ({ listing : response }));
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
