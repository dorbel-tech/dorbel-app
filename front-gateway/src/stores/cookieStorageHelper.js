'use strict';
import cookies from 'cookies.js';

function setItem(key, item, expiry) {
  if (process.env.IS_CLIENT) {
    cookies.setItem(key, item, expiry);
  }
}

module.exports = {
  setItem
};
