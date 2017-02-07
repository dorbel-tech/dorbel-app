/** 
 * This module provides data enrichment functions needed by the notification-sender 
 * To enrich the different data needed by each notification type before it is sent 
 */ 
'use strict'; 
const shared = require('dorbel-shared');
const config = shared.config;
var ical = require('ical-generator');
const tzName = 'Asia/Jerusalem';
const website_url = config.get('FRONT_GATEWAY_URL') || 'https://app.dorbel.com';

// Calendar invite ICS file building. 
// Requires listing: {...}, ohe: {...} and user_profile: {...} objects in additonalData.
function buildCalendarInvite(additonalData, method) {
  let cal = ical({domain: 'dorbel.com', timezone: tzName});
  let event = cal.createEvent({
    organizer: 'dorbel <homesupport@dorbel.com>',
    start: additonalData.ohe.start_time,
    end: additonalData.ohe.end_time,
    summary: 'ביקור בדירה ברח׳ ' + additonalData.listing.apartment.building.street_name,
    location: additonalData.listing.apartment.building.street_name + ' ' + additonalData.listing.apartment.building.house_number + ', ' + additonalData.listing.apartment.building.city.city_name,
    description: 'הזמן שלכם ושל בעלי הדירה חשוב לנו, לכן במידה ומשהו משתנה ואינכם יכולים להגיע לביקור, אנא בטלו הגעתכם. אבל חבל, מי יודע, אולי זו תהיה האחת בשבילכם.',
    url: website_url + '/apartments/' + additonalData.listing.id,
    method: method,
    status: method === 'publish' ? 'confirmed' : 'cancelled'
  });
  event.createAttendee({ email: additonalData.user_profile.email, status: 'accepted' });
  return cal.toString();
}

const dataEnrichmentFunctions = { 
  // Create calendar invitation for OHE related types of events
  addCalendarInvite: (eventData, additonalData) => {
    let calInvite = buildCalendarInvite(additonalData, 'publish');
    return { attachments: { 'event.ics': calInvite } }; // Adding calendar event attachment.
  },
  // Create calendar invitate cancelation for OHE related types of events
  cancelCalendarInvite: (eventData, additonalData) => {
    let calInvite = buildCalendarInvite(additonalData, 'cancel');
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
