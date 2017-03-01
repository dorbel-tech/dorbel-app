const _ = require('lodash');

// Return a random number between 1 and 10.
function getSmallRandomNumber() {
  return _.random(1, 10);
}

// Return a random number between 10 and 100.
function getMediumRandomNumber() {
  return _.random(10, 100);
}

// Return a random number between 1000 and 10000.
function getBigRandomNumber() {
  return _.random(1000, 10000);
}

module.exports = {
  getSmallRandomNumber,
  getMediumRandomNumber,
  getBigRandomNumber
};
