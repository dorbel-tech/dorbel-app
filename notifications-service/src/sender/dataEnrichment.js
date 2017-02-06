/** 
 * This module provides data enrichment functions needed by the notification-sender 
 * To enrich the different data needed by each notification type before it is sent 
 */ 
'use strict'; 
const ICS = require('ics');
const ics = new ICS();
const moment = require('moment');

function convertDate(date) {
  console.log('====> date before:', date);
  console.log('====> date after:', moment(date).tz('Asia/Jerusalem').format());
  return moment(date).tz('Asia/Jerusalem').format();
}

// Calendar invite ICS file building. 
// Requires listing: {...}, ohe: {...} and user_profile: {...} objects in additonalData.
function buildCalendarInvite(additonalData, status) {
  return ics.buildEvent({
    start: convertDate(additonalData.ohe.start_time),
    end: convertDate(additonalData.ohe.end_time),
    title: 'ביקור בדירה ברח׳ ' + additonalData.listing.apartment.building.street_name,
    location: additonalData.listing.apartment.building.street_name + ' ' + additonalData.listing.apartment.building.house_number + ', ' + additonalData.listing.apartment.building.city.city_name,
    description: 'הזמן שלכם ושל בעלי הדירה חשוב לנו, לכן במידה ומשהו משתנה ואינכם יכולים להגיע לביקור, אנא בטלו הגעתכם. אבל חבל, מי יודע, אולי זו תהיה האחת בשבילכם.',
    url: 'https://app.dorbel.com/apartments/' + additonalData.listing.id,
    status: status,
    attendees: [
      { email: additonalData.user_profile.email },
    ]      
  });
}

const dataEnrichmentFunctions = { 
  // Create calendar invitation for OHE related types of events
  addCalendarInvite: (eventData, additonalData) => {
    let calInvite = buildCalendarInvite(additonalData, 'confirmed');
    return { attachments: { 'event.ics': calInvite } }; // Adding calendar event attachment.
  },
  // Create calendar invitate cancelation for OHE related types of events
  cancelCalendarInvite: (eventData, additonalData) => {
    let calInvite = buildCalendarInvite(additonalData, 'cancelled');
    return { attachments: { 'event.ics': calInvite } }; // Adding calendar event attachment.
  }
}; 
 
function enrichAdditonalData(eventConfig, eventData, additonalData) {
  const dataEnrichment = eventConfig.dataEnrichment || [];

  return Promise.all(
    dataEnrichment 
    .filter(enrichmentFunctionName => dataEnrichmentFunctions[enrichmentFunctionName]) // only take ones that actually exist 
    .map(enrichmentFunctionName => dataEnrichmentFunctions[enrichmentFunctionName](eventData, additonalData)) // run the functions 
  ) 
  .then(results => { 
    // all results are returned as one object, duplicate keys will be removed
    // prioritizing according to the order in eventConfig.dataEnrichment  
    return results.reduce((prev, current) => Object.assign(prev, current), {}); 
  }); 
} 

module.exports = {
  enrichAdditonalData
};
