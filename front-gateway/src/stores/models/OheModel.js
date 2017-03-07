'use strict';
import utils from '~/providers/utils';

export default class OheModel {
  constructor(params) {
    Object.assign(this, params);
  }

  // All these are getters since we don't want their values to be saved to the OheStore
  // Thats because they are timezone dependant and should be re-calculated on the client side

  get timeLabel() {
    return `${utils.formatTime(this.end_time)} - ${utils.formatTime(this.start_time)}`;
  }

  get dateLabel() {
    return utils.formatDate(this.start_time);
  }

  get dayLabel() {
    return utils.formatDay(this.start_time);
  }
}
