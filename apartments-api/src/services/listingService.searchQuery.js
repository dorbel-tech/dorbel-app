const _ = require('lodash');
const moment = require('moment');
const shared = require('dorbel-shared');
const listingRepository = require('../apartmentsDb/repositories/listingRepository');
const userPermissions = shared.utils.user.permissions;
const ValidationError = shared.utils.domainErrors.DomainValidationError;

const DEFUALT_LISTING_LIST_LIMIT = 15;
const MAX_LISTING_LIST_LIMIT = 30;

function CustomError(code, message) {
  let error = new Error(message);
  error.status = code;
  return error;
}

function getListingQuery(filter, options) {
  // TODO: refactor one big method to smaller ones

  if (options.limit && options.limit > MAX_LISTING_LIST_LIMIT) {
    throw new ValidationError('Unable to return so many lising results in one query! Limit asked: ' + options.limit);
  }

  const listingQuery = [];

  let statusQuery = { $or: [
    { status: 'listed' },
    { status: 'rented',
      lease_end: { $gte: moment().add(1, 'month').toDate() }, // lease ends at least a month from now
      show_for_future_booking: true
    }
  ] };

  if (filter.futureBooking === false) {
    statusQuery = { status: 'listed' };
  }

  let queryOptions = {
    order: filter.order || 'created_at DESC',
    limit: options.limit || DEFUALT_LISTING_LIST_LIMIT,
    offset: options.offset || 0,
    oldListings: filter.oldListings
  };

  if (options.user) {
    if (userPermissions.isUserAdmin(options.user)) {
      filter.listed = _.has(filter, 'listed') ? filter.listed : true;

      const filteredStatuses = listingRepository.listingStatuses.filter(
        status => !filter[status]
      );

      // Check if admin filtered statuses manually.
      if (filteredStatuses.length === 0) {
        statusQuery = null;
      } else {
        statusQuery = { status: { $notIn: filteredStatuses } };
      }
    }

    if (filter.liked) {
      statusQuery = { status: { $notIn: ['deleted'] } };
      queryOptions.limit = undefined; // Since no pagination in liked apartments, removing limit.

      queryOptions.likeQuery = {
        is_active: true,
        liked_user_id: options.user.id
      };
    }

    if (filter.myProperties) {
      if (!userPermissions.isUserAdmin(options.user)) {
        listingQuery.push({ publishing_user_id: options.user.id });
      }

      statusQuery = { status: { $notIn: ['deleted'] } };
    }
  } else if (!options.user && (filter.myProperties || filter.liked)) {
    throw CustomError(403, 'unauthorized for this view');
  }

  if (filter.city === '*') {
    _.unset(filter, 'city');
  }

  var filterMapping = {
    // Listing monthly rent start (minimum)
    mrs: { set: 'monthly_rent.$gte', target: listingQuery },
    // Listing monthly rent end (maximum)
    mre: { set: 'monthly_rent.$lte', target: listingQuery },
    // Listing with a roomate (a roomate looking for roomate/s).
    room: { set: 'roommate_needed', target: listingQuery },
    city: { set: 'buildingQuery.city_id' },
    ele: { set: 'buildingQuery.elevator', staticValue: true },
    minRooms: { set: 'apartmentQuery.rooms.$gte' },
    maxRooms: { set: 'apartmentQuery.rooms.$lte' },
    park: { set: 'apartmentQuery.parking', staticValue: true },
    balc: { set: 'apartmentQuery.balcony', staticValue: true },
    ac: { set: 'apartmentQuery.air_conditioning', staticValue: true },
    pet: { set: 'apartmentQuery.pets', staticValue: true },
    sb: { set: 'apartmentQuery.security_bars', staticValue: true },
    apartment_id: { set: 'apartment_id', target: listingQuery }
  };

  Object.keys(filterMapping)
    .filter(key => _.has(filter, key))
    .forEach(key => {
      const map = filterMapping[key];
      const fieldName = map.set;
      const value = map.staticValue || filter[key];

      if (Array.isArray(map.target)) {
        map.target.push(_.set({}, fieldName, value));
      } else {
        _.set(map.target || queryOptions, fieldName, value);
      }
    });

  if (filter.minLease || filter.maxLease) {
    listingQuery.push(getDateRangeQuery(filter));
  }

  if (statusQuery) {
    listingQuery.push(statusQuery);
  }

  return {
    listingQuery : { $and: listingQuery },
    queryOptions
  };
}

function getDateRangeQuery(filter) {
  let dateRange;
  if (filter.minLease && filter.maxLease) {
    dateRange = { $between: [ filter.minLease, moment(filter.maxLease).endOf('day').toISOString() ] };
  } else if (filter.minLease) {
    dateRange = { $gte: filter.minLease };
  } else {
    dateRange = { $lte: moment(filter.maxLease).endOf('day').toISOString() };
  }

  return {
    $or: [
      { status: 'listed', lease_start: dateRange },
      { status: 'rented', lease_end: dateRange }
    ]
  };
}

module.exports = {
  getListingQuery
};
