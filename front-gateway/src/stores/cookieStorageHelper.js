'use strict';
import cookies from 'cookies.js';

function setItem(key, item, expiry) {
  if (process.env.IS_CLIENT) {
    if (cookies.hasItem(key)) {
      cookies.removeItem(key, '/');
    }
    cookies.setItem(key, item, expiry, '/');
  }
}

function removeItem(key) {
  if (process.env.IS_CLIENT) {
    cookies.removeItem(key, '/');
  }
}

module.exports = {
  setItem,
  removeItem
};
