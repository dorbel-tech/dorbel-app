'use strict';
import _ from 'lodash';

function isValid(inputElement) {
  if (inputElement.getAttribute('required') !== null && !inputElement.value) {
    return false;
  }
  
  return true;
}

module.exports = {
  isValid
};
