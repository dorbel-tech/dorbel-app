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

function optimizeCloudinaryUrl(url, width, height, addWatermark) {
  let optionsStr = addWatermark ? 'c_fill' : 'c_fit';
  optionsStr += ',f_auto,q_auto,e_improve';

  if (width) { optionsStr += ',w_' + width; }
  if (height) { optionsStr += ',h_' + height; }
  if (addWatermark) { optionsStr += '/c_scale,g_north_east,l_dorbel_watermark2,w_300,x_30,y_30'; }
  return url && url.replace('upload', 'upload/' + optionsStr);
}

function getUserNickname(user) {
  return user.first_name || user.email.substring(0, user.email.lastIndexOf('@'));
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
    deleted: { label: 'נמחקה' },
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

function getPercentageOfTotal(totalValue, partialValue) {
  return (partialValue / totalValue * 100);
}

// decimal.toFixed(1) rounds the numbers in some cases so regex is used instead
function decimalToPercision(decimal, percision) {
  const regex = new RegExp('^-?\\d+(?:\\.\\d{0,' + percision + '})?');
  const percisionValueStr = decimal.toString().match(regex)[0];
  return parseFloat(percisionValueStr, percision);
}

function hideIntercom(bool) {
  const intercomContainer = document.getElementById('intercom-container');

  if (intercomContainer) {
    intercomContainer.style.display = bool ? 'none' : 'block';
  }
}

function getShareUrl(currentUrl, utm_campaign, doEncode) {
  const shareUrl = currentUrl + '?utm_source=app&utm_medium=share&utm_campaign=' + utm_campaign;
  return doEncode ? encodeURIComponent(url) : shareUrl;
}

function asPromise(func) {
  return new Promise(resolve => resolve(func()));
}

module.exports = {
  formatTime,
  formatDate,
  formatDay,
  getPercentageOfTotal,
  decimalToPercision,
  optimizeCloudinaryUrl,
  getFloorTextValue,
  getListingStatusLabels,
  getListingSubTitle,
  getListingTitle,
  getListingLeaseStats,
  getUserNickname,
  sortListingImages,
  promiseSeries,
  isMobile,
  flushPromises,
  hideIntercom,
  getShareUrl,
  asPromise
};
