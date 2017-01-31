'use strict';

function getItem(key) {
  if (process.env.IS_CLIENT) {
    const rawItem = localStorage.getItem(key);
    if (rawItem) {
      try {
        const item = JSON.parse(rawItem);
        return item;
      }
      catch (ex) {
        // item in localStorage is not parseable
        localStorage.removeItem(key);
      }
    }
  }
}

function setItem(key, item) {
  if (item === undefined) {
    // undefined cannot be stringified and parsed but null can
    item = null;
  }

  if (process.env.IS_CLIENT) {
    localStorage.setItem(key, JSON.stringify(item));
  }
}

module.exports = {
  getItem,
  setItem
};
