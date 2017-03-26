/***
 * General utils modeule
 */
'use strict';
import _ from 'lodash';
import moment from 'moment';
import isMobileJs from 'ismobilejs';

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

function getListingSubTitle(listing) {
  return listing.apartment.building.street_name + ', ' + listing.apartment.building.city.city_name;
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

function promiseSeries(functionsThatReturnPromises, allResults) {
  allResults = allResults || [];

  if (!functionsThatReturnPromises || functionsThatReturnPromises.length === 0) {
    return Promise.resolve(allResults);
  }

  const firstFunc = functionsThatReturnPromises.shift();

  return firstFunc()
  .then(result => {
    allResults.push(result);
    return promiseSeries(functionsThatReturnPromises, allResults);
  });
}

function isMobile() {
  return isMobileJs.any;
}

module.exports = {
  formatTime,
  formatDate,
  formatDay,
  getListingSubTitle,
  getListingTitle,
  sortListingImages,
  getListingStatusLabels,
  promiseSeries,
  isMobile
};
