const _ = require('lodash');

module.exports = {
  // Return a random number between 1 and 10.
  get10RandomNumber: function() {
    _.random(1, 10);
  },

  // Return a random number between 10 and 100.
  get100RandomNumber: function() {
    _.random(10, 100);
  },

  // Return a random number between 100 and 1000.
  get1000RandomNumber: function() {
    _.random(100, 1000);
  },

  // Return a random number between 1000 and 10000.
  get10000RandomNumber: function() {
    _.random(1000, 10000);
  }
  
};
