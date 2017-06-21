'use strict';
const shared = require('dorbel-shared');
const filterRepository = require('../apartmentsDb/repositories/filterRepository');

const MAX_FILTERS_PER_USER = 3;
const filterEqualityFields = [ 'city', 'neighborhood', 'min_monthly_rent', 'max_monthly_rent', 'min_rooms', 'max_rooms',
  'air_conditioning', 'balcony', 'elevator', 'parking', 'pets', 'security_bars', 'future_booking' ];
const filterUpdateFields = filterEqualityFields.concat(['email_notification']);
const errors = shared.utils.domainErrors;

function * create(filterToCreate, user) {
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

  // set null instead of undefined so we are overwriting the existing filter and not merging into it
  Object.keys(filterUpdate).filter(key => filterUpdate[key] === undefined).forEach(key => filterUpdate[key] = null);
  // email_notification can't be null so it will be false if undefined or null
  filterUpdate.email_notification = !!filterUpdate.email_notification;
  yield filter.update(filterUpdate, { fields: filterUpdateFields });
  return filter;
}

function getByUser(user) {
  return filterRepository.getByUser(user.id);
}

function destory(filterId, user) {
  return filterRepository.destroy(filterId, user.id);
}

function checkForDuplicateFilters(usersExistingFilters, newFilter) {
  return usersExistingFilters.find(existingFilter => filtersAreEqual(newFilter, existingFilter));
}

function filtersAreEqual(filter1, filter2) {
  return filterEqualityFields.every(field => filter1[field] == filter2[field]);
}

module.exports = {
  create,
  getByUser,
  destory,
  update
};
