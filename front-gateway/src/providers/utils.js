/***
 * General utils modeule
 */
'use strict';
import _ from 'lodash';
import moment from 'moment';

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';
const dayFormat = 'dd';

function formatTime(date) {
  return moment.utc(date).local().format(timeFormat);
}

function formatDate(date) {
  return moment.utc(date).local().format(dateFormat);
}

function formatDay(date) {
  return moment.utc(date).local().format(dayFormat);
}

function getListingTitle(listing) {
  return listing.title || `דירת ${listing.apartment.rooms} חד׳ ב${listing.apartment.building.street_name}`;  
}

function sortListingImages(listing) {
  return listing.images.length ? _.orderBy(listing.images, ['display_order']) : [];
}

function getListingStatusLabels() {
  return {
    pending: { label: 'ממתינה לאישור', actionLabel: 'החזר את הדירה להמתנה' },
    listed: { label: 'מפורסמת', actionLabel: 'פרסם את הדירה' },
    rented: { label: 'מושכרת', actionLabel: 'הדירה הושכרה' },
    unlisted: { label: 'לא פעילה', actionLabel: 'השהה מודעה' },
    deleted: { label: 'נמחקה', actionLabel: 'מחק מודעה' }
  };
}


module.exports = {
  formatTime,
  formatDate,
  formatDay,
  getListingTitle,
  sortListingImages,
  getListingStatusLabels
};
