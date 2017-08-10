'use strict';
const _ = require('lodash');
const filterService = require('../../services/filterService');

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

const mapFilter = createObjectByMapping.bind(null, clientToApiFilterMap);

async function post(ctx) {
  const filterToCreate = mapFilter(ctx.request.body);
  const createdFilter = await filterService.create(filterToCreate, ctx.request.user);
  ctx.response.body = mapFilter(createdFilter, true);
  ctx.response.status = 200;
}

async function get(ctx) {
  let filters;
  if (ctx.request.query.matchingListingId) {
    filters = await filterService.getFilterByMatchedListing(ctx.request.query.matchingListingId, ctx.request.user);
  } else {
    filters = await filterService.getByUser(ctx.request.user);
  }
  ctx.response.body = filters.map(filter => mapFilter(filter, true));
  ctx.response.status = 200;
  return Promise.resolve();
}

async function destory (ctx) {
  const filterId = parseInt(ctx.params.filterId);
  await filterService.destory(filterId, ctx.request.user);
  ctx.response.status = 204;
}

async function put (ctx) {
  const filterId = parseInt(ctx.params.filterId);
  const filterUpdate = mapFilter(ctx.request.body);
  const updatedFilter = await filterService.update(filterId, filterUpdate, ctx.request.user);
  ctx.response.body = mapFilter(updatedFilter, true);
  ctx.response.status = 200;
}

// TODO : put some place generic
function createObjectByMapping(mapping, sourceObject, reverseMapping) {
  const [ sourceIndex, targetIndex ] = reverseMapping ? [ 1, 0 ] : [ 0, 1 ];
  const result = {};
  mapping.forEach(fieldMap => {
    if (_.isArray(fieldMap) && fieldMap.length === 2) {
      _.set(result, fieldMap[targetIndex], _.get(sourceObject, fieldMap[sourceIndex]));
    } else if (_.isString(fieldMap)) {
      _.set(result, fieldMap, _.get(sourceObject, fieldMap));
    }
  });
  return result;
}

module.exports = {
  get: get,
  delete: destory,
  post,
  put
};
