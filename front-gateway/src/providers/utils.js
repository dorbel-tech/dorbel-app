/***
 * General utils modeule
 */
'use strict';
import moment from 'moment';

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';

function formatTime(date) {
  return moment.utc(date).local().format(timeFormat);
}

function formatDate(date) {
  return moment.utc(date).local().format(dateFormat);
}

function getListingTitle(listing) {
  return listing.title || `דירת ${listing.apartment.rooms} חד׳ ברח׳ ${listing.apartment.building.street_name}`;  
}

module.exports = {
  formatTime,
  formatDate,
  getListingTitle
};
