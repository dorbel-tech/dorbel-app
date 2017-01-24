/***
 * General utils modeule
 */
'use strict';
import moment from 'moment';

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';

function formatTime(date) {
  return moment.utc(date).local().format(timeFormat);
}

function formatDate(date) {
  return moment.utc(date).local().format(dateFormat);
}

module.exports = {
  formatTime,
  formatDate
};
