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

function getListingQuery(filterJSON, options) {
  // TODO: refactor one big method to smaller ones
  // TODO: Switch to regex test instead of try-catch.
  // TODO: filter string-to-json belongs in the controller layer - it's an interface detail and not a business concern
  let filter = {};
  if (filterJSON) {
    try {
      filter = JSON.parse(filterJSON);
    } catch (e) {
      throw new ValidationError('Failed to parse filter JSON!');
    }
  }

  if (options.limit && options.limit > MAX_LISTING_LIST_LIMIT) {
    throw new ValidationError('Unable to return so many lising results in one query! Limit asked: ' + options.limit);
  }

  const listingQuery = [];
  let statusQuery = { status: 'listed' };

  if (filter.futureBooking) {
    statusQuery = { $or: [
      { status: 'listed' },
      { status: 'rented',
        lease_end: { $gte: moment().add(1, 'month').toDate() }, // lease ends at least a month from now
        show_for_future_booking: true
      }
    ] };
  }

  let queryOptions = {
    order: getSortOption(filter.sort),
    limit: options.limit || DEFUALT_LISTING_LIST_LIMIT,
    offset: options.offset || 0,
    oldListings: filter.oldListings
  };

  if (options.user) {
    if (userPermissions.isUserAdmin(options.user)) {
      filter.listed = filter.hasOwnProperty('listed') ? filter.listed : true;

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
  if (filter.neighborhood === '*') {
    _.unset(filter, 'neighborhood');
  }

  var filterMapping = {
    // Listing monthly rent start (minimum)
    mrs: { set: 'monthly_rent.$gte', target: listingQuery },
    // Listing monthly rent end (maximum)
    mre: { set: 'monthly_rent.$lte', target: listingQuery },
    // Listing with a roomate (a roomate looking for roomate/s).
    room: { set: 'roommate_needed', target: listingQuery },
    city: { set: 'buildingQuery.city_id' },
    neighborhood: { set: 'neighborhoodQuery.id' },
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
    .filter(key => filter.hasOwnProperty(key))
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

function getSortOption(sortStr) {
  switch (sortStr) {
    case 'lease_start':
      return 'lease_start ASC';
    case 'publish_date':
      return 'created_at DESC';

    default:
      return 'created_at DESC';
  }
}

function getDateRangeQuery(filter) {
  let dateRange;
  if (filter.minLease && filter.maxLease) {
    dateRange = { $between: [ filter.minLease, filter.maxLease ] };
  } else if (filter.minLease) {
    dateRange = { $gte: filter.minLease };
  } else {
    dateRange = { $lte: filter.maxLease };
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
