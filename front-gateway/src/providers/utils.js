/***
 * General utils module
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

function optimizeCloudinaryUrl(url, width, height) {
  let optionsStr = 'c_fit,f_auto,q_auto,e_improve';
  if (width) { optionsStr += ',w_' + width; }
  if (height) { optionsStr += ',h_' + height; }
  return url && url.replace('upload', 'upload/' + optionsStr);
}

function getListingTitle(listing) {
  return listing.title || `דירת ${listing.apartment.rooms} חד׳ ב${listing.apartment.building.street_name}`;
}

function getListingLeaseStats(listing) {
  const leaseStart = formatDate(listing.lease_start);
  const leaseEnd = formatDate(listing.lease_end);
  const leasePeriod = moment(listing.lease_end).diff(moment(listing.lease_start), 'days');
  const daysPassedUntilToday = moment().diff(moment(listing.lease_start), 'days');
  const daysPassed = daysPassedUntilToday < leasePeriod ? daysPassedUntilToday : leasePeriod;
  const daysPassedLabel = daysPassed > 0 ? daysPassed : 0;
  const dasysLeftUntilToday = (leasePeriod - daysPassed);
  const daysLeft = dasysLeftUntilToday > leasePeriod ? leasePeriod : dasysLeftUntilToday;

  return {
    leaseStart,
    leaseEnd,
    leasePeriod,
    daysPassed,
    daysPassedLabel,
    daysLeft
  };
}

function getListingSubTitle(listing) {
  const building = listing.apartment.building;
  const neighborhoodName = building.neighborhood.neighborhood_name;
  const neighborhoodPrefix = neighborhoodName === 'אחר' ? '' : neighborhoodName + ', ';

  return neighborhoodPrefix + building.city.city_name;
}

function getFloorTextValue(listing) {
  let textValue = listing.apartment.floor;
  const floors = listing.apartment.building.floors;
  if (floors) { textValue += '/' + floors; }

  return textValue;
}

function sortListingImages(listing) {
  let listingImages = [];
  if (listing && listing.images) {
    listingImages = listing.images;
  }
  return listingImages.length ? _.orderBy(listingImages, ['display_order']) : [{ url: 'https://static.dorbel.com/images/meta/no-image-placeholder.svg' }];
}

// TODO : this function does not belong in utils - it's a i18n thing and it's also static
function getListingStatusLabels() {
  return {
    pending: { label: 'ממתינה לאישור', actionLabel: 'החזר את הדירה להמתנה' },
    listed: { label: 'מפורסמת', actionLabel: 'פרסם את הדירה' },
    rented: { label: 'טרם פורסמה', actionLabel: 'הדירה הושכרה', landlordLabel: 'מושכרת' },
    unlisted: { label: 'לא פעילה', actionLabel: 'השהה מודעה' },
    deleted: { label: 'נמחקה', actionLabel: 'מחק מודעה' },
    republish: { label: '', actionLabel: 'פרסום הנכס מחדש' }
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

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

function setIntercomStyle(display) {
  const intercomContainer = document.getElementById('intercom-container');

  if (intercomContainer) {
    intercomContainer.style.display = display;
  }
}

module.exports = {
  formatTime,
  formatDate,
  formatDay,
  optimizeCloudinaryUrl,
  getFloorTextValue,
  getListingStatusLabels,
  getListingSubTitle,
  getListingTitle,
  getListingLeaseStats,
  sortListingImages,
  promiseSeries,
  isMobile,
  flushPromises,
  setIntercomStyle
};
