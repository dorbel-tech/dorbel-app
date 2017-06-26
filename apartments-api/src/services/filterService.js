'use strict';
const shared = require('dorbel-shared');
const filterRepository = require('../apartmentsDb/repositories/filterRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');

const MAX_FILTERS_PER_USER = 3;
const filterUpdateFields = [ 'city', 'neighborhood', 'min_monthly_rent', 'max_monthly_rent', 'min_rooms', 'max_rooms',
  'air_conditioning', 'balcony', 'elevator', 'parking', 'pets', 'security_bars', 'future_booking', 'email_notification' ];
const errors = shared.utils.domainErrors;

function * create(filterToCreate, user) {
  normalizeFilterFields(filterToCreate);
  const usersExistingFilters = yield filterRepository.getByUser(user.id);

  const duplicateFilter = checkForDuplicateFilters(usersExistingFilters, filterToCreate);
  if (duplicateFilter) {
    return duplicateFilter;
  }

  if (usersExistingFilters.length >= MAX_FILTERS_PER_USER) {
    throw new errors.DomainValidationError('max_filters_reached', null, 'לא ניתן לשמור יותר משלושה חיפושים. לשמירת חיפוש נוסף עדכנו את אחד הקיימים.');
  }

  filterToCreate.dorbel_user_id = user.id;
  return filterRepository.create(filterToCreate);
}

function * update(filterId, filterUpdate, user) {
  normalizeFilterFields(filterUpdate);
  const filter = yield filterRepository.getById(filterId);

  if (!filter) {
    throw new errors.DomainNotFoundError('filter not found', { filterId }, 'filter not found');
  } else if (filter.dorbel_user_id !== user.id) {
    throw new errors.NotResourceOwnerError();
  }

  const usersExistingFilters = yield filterRepository.getByUser(user.id);
  const duplicateFilter = checkForDuplicateFilters(usersExistingFilters, filterUpdate);
  if (duplicateFilter) {
    return duplicateFilter;
  }

  yield filter.update(filterUpdate, { fields: filterUpdateFields });
  return filter;
}

function getByUser(user) {
  return filterRepository.getByUser(user.id);
}

function destory(filterId, user) {
  return filterRepository.destroy(filterId, user.id);
}

function * getFilterByMatchedListing(listing_id, user) {
  if (user.role !== 'admin') {
    throw new errors.NotResourceOwnerError();
  }

  const listing = yield listingRepository.getById(listing_id);

  if (!listing) {
    throw new errors.DomainNotFoundError('listing not found', { listing_id }, 'listing not found');
  }

  const query = mapListingToMatchingFilterQuery(listing);
  return filterRepository.find(query);
}

function mapListingToMatchingFilterQuery(listing) {
  return {
    email_notification: true, // only return the filters that require email notification
    city: listing.apartment.building.city_id,
    neighborhood: nullOrEqualTo(listing.apartment.building.neighborhood_id),
    min_monthly_rent: nullOrModifier('$lte', listing.monthly_rent),
    max_monthly_rent: nullOrModifier('$gte', listing.monthly_rent),
    min_rooms: nullOrModifier('$lte', listing.apartment.rooms),
    max_rooms: nullOrModifier('$gte', listing.apartment.rooms),
    air_conditioning: nullOrEqualTo(listing.apartment.air_conditioning),
    balcony: nullOrEqualTo(listing.apartment.balcony),
    parking: nullOrEqualTo(listing.apartment.parking),
    pets: nullOrEqualTo(listing.apartment.pets),
    security_bars: nullOrEqualTo(listing.apartment.security_bars),
    elevator: nullOrEqualTo(listing.apartment.building.elevator),
    future_booking: nullOrEqualTo(listing.status === 'rented' && listing.show_for_future_booking)
  };
}

function nullOrEqualTo(value) {
  return nullOrModifier('$eq', value);
}

function nullOrModifier(modifier, value) {
  return { 
    $or: [
      { $eq: null },
      { [modifier]: value }
    ]
  };
}

function checkForDuplicateFilters(usersExistingFilters, newFilter) {
  return usersExistingFilters.find(existingFilter => filtersAreEqual(newFilter, existingFilter));
}

function filtersAreEqual(filter1, filter2) {
  return filterUpdateFields.every(field => filter1[field] == filter2[field]);
}

function normalizeFilterFields(filter) {
  // set null instead of undefined so we are overwriting the existing filter and not merging into it
  Object.keys(filter).filter(key => filter[key] === undefined).forEach(key => filter[key] = null);
  // email_notification can't be null so it will be false if undefined or null
  filter.email_notification = !!filter.email_notification;
}

module.exports = {
  create,
  getByUser,
  getFilterByMatchedListing,
  destory,
  update
};
