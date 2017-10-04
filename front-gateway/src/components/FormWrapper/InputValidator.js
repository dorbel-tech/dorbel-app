'use strict';
import _ from 'lodash';

function invalidate(inputElement, invalidFieldMap) {
  if (inputElement.getAttribute('required') !== null && !inputElement.value) {
    invalidFieldMap[inputElement.name] = 'שדה חובה';
  } else {
    delete invalidFieldMap[inputElement.name];
  }
  
  return invalidFieldMap;
}

module.exports = {
  invalidate
};
