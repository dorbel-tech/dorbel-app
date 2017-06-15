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
  ['ele', 'elevator']
];

const mapFilter = createObjectByMapping.bind(null, clientToApiFilterMap);

function * post() {
  const filterToCreate = mapFilter(this.request.body);
  const createdFilter = yield filterService.create(filterToCreate, this.request.user);
  this.response.body = mapFilter(createdFilter, true);
  this.response.status = 200;
}

function * get() {
  const usersFilters = yield filterService.getByUser(this.request.user);
  this.response.body = usersFilters.map(filter => mapFilter(filter, true));
  this.response.status = 200;
}

function * destory () {
  const filterId = parseInt(this.params.filterId);
  yield filterService.destory(filterId, this.request.user);
  this.response.status = 204;
}

function * put () {
  const filterId = parseInt(this.params.filterId);
  const filterUpdate = mapFilter(this.request.body);
  const updatedFilter = yield filterService.update(filterId, filterUpdate, this.request.user);
  this.response.body = mapFilter(updatedFilter, true);
  this.response.status = 200;
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
