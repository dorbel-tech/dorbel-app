'use strict';
const shared = require('dorbel-shared');
const filterRepository = require('../apartmentsDb/repositories/filterRepository');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const { createObjectByMapping } = require('./utils');

const MAX_FILTERS_PER_USER = 2;
const filterUpdateFields = [ 'city', 'neighborhood', 'min_monthly_rent', 'max_monthly_rent', 'min_rooms', 'max_rooms',
  'air_conditioning', 'balcony', 'elevator', 'parking', 'pets', 'security_bars', 'future_booking', 'min_lease_start', 'max_lease_start' ];
const errors = shared.utils.domainErrors;

const clientToApiFilterMap = [
  'dorbel_user_id',
  'id',
  'email_notification',
  'city',
  'neighborhood',
  ['mrs', 'min_monthly_rent'],
  ['mre', 'max_monthly_rent'],
  ['minRooms', 'min_rooms'],
  ['maxRooms', 'max_rooms'],
  ['ac', 'air_conditioning'],
  ['balc', 'balcony'],
  ['park', 'parking'],
  ['pet', 'pets'],
  ['sb', 'security_bars'],
  ['futureBooking', 'future_booking'],
  ['ele', 'elevator'],
  ['minLease', 'min_lease_start'],
  ['maxLease', 'max_lease_start']
];

async function create(filterToCreate, user) {
  filterToCreate = mapFilter(filterToCreate);
  normalizeFilterFields(filterToCreate);
  const usersExistingFilters = await filterRepository.getByUser(user.id);

  const duplicateFilter = checkForDuplicateFilters(usersExistingFilters, filterToCreate);
  if (duplicateFilter) {
    return mapFilter(duplicateFilter, true);
  }

  if (usersExistingFilters.length >= MAX_FILTERS_PER_USER) {
    throw new errors.DomainValidationError('max_filters_reached', null, 'לא ניתן לשמור יותר משני חיפושים. לשמירת חיפוש נוסף עדכנו את אחד הקיימים.');
  }

  filterToCreate.dorbel_user_id = user.id;
  filterToCreate.email_notification = usersExistingFilters.length > 0 ? usersExistingFilters[0].email_notification : true;
  const createdFilter = await filterRepository.create(filterToCreate);
  return mapFilter(createdFilter, true);
}

async function update(filterId, filterUpdate, user) {
  filterUpdate = mapFilter(filterUpdate);
  normalizeFilterFields(filterUpdate);
  const filter = await filterRepository.getById(filterId);

  if (!filter) {
    throw new errors.DomainNotFoundError('filter not found', { filterId }, 'filter not found');
  } else if (filter.dorbel_user_id !== user.id) {
    throw new errors.NotResourceOwnerError();
  }

  const usersExistingFilters = await filterRepository.getByUser(user.id);
  const duplicateFilter = checkForDuplicateFilters(usersExistingFilters, filterUpdate);
  if (duplicateFilter) {
    return mapFilter(duplicateFilter, true);
  }

  await filter.update(filterUpdate, { fields: filterUpdateFields });
  return mapFilter(filter, true);
}

function upsert(filter, user) {
  return filter.id ? update(filter.id, filter, user) : create(filter, user);
}

function getByUser(user) {
  if (!user) {
    throw new errors.NotResourceOwnerError();
  }
  return filterRepository.getByUser(user.id).then(filters => filters.map(filter => mapFilter(filter, true)));
}

function destory(filterId, user) {
  return filterRepository.destroy(filterId, user.id);
}

async function getFilterByMatchedListing(listing_id, user) {
  const listing = await listingRepository.getById(listing_id);
  if (!listing) {
    throw new errors.DomainNotFoundError('listing not found', { listing_id }, 'listing not found');
  }
  else if (listing.status === 'rented' && !listing.show_for_future_booking) {
    // rented && not showed for future listing - this listing should not be matched by any filter.
    return [];
  }
  else if (shared.utils.user.permissions.isResourceOwnerOrAdmin(user, listing.publishing_user_id)) {
    const query = mapListingToMatchingFilterQuery(listing);
    return filterRepository.find(query).then(filters => filters.map(filter => mapFilter(filter, true)));
  }
  else {
    throw new errors.NotResourceOwnerError();
  }
}

function toggleEmail(email_notification, user) {
  if (!user || !user.id) {
    throw new errors.NotResourceOwnerError();
  }

  return filterRepository.updateEmailNotification(email_notification, user.id)
    .then(() => email_notification);
}

function mapListingToMatchingFilterQuery(listing) {
  const filterQuery = {};
  const listingReferenceDate = listing.status === 'rented' ? listing.lease_end : listing.lease_start;

  if (listing.status === 'rented' && listing.show_for_future_booking) {
    // only show filters that are looking for future_booking or don't care
    filterQuery.future_booking = nullOrEqualTo(true);
    // otherwise (listing is listed) we take all future_booking values
    // assuming that rented && !show_for_future_booking listings dont get to this stage
  }

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
    min_lease_start: nullOrModifier('$lte', listingReferenceDate),
    max_lease_start: nullOrModifier('$gte', listingReferenceDate)
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
}

function mapFilter(source, reverseOrder) {
  return createObjectByMapping(clientToApiFilterMap, source, reverseOrder);
}

module.exports = {
  create,
  getByUser,
  getFilterByMatchedListing,
  destory,
  update,
  upsert,
  toggleEmail
};
