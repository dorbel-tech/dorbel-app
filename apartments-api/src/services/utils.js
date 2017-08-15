'use strict';
const _ = require('lodash');

/**
 * @param {string[][]} mapping - An Array of Arrays, each containing the name of the fields to be mapped. If a field exists by same name in both mappings, it can be just a single string value.
 * @param {*} sourceObject - The object to map from
 * @param {*} reverseMapping - Reverse the mapping order (from target to source)
 */
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
  createObjectByMapping
};
