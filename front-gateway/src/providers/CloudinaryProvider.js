'use strict';
import axios from 'axios';
import _ from 'lodash';

class CloudinaryProvider {
  constructor() {
    // will only work on client side
    this.params = global.window && global.window.dorbelConfig.CLOUDINARY_PARAMS;
  }

  upload(file) {
    let formData = new FormData();
    _.each(this.params, (value, key) => formData.append(key, value));
    formData.append('file', file);

    return axios.post('https://api.cloudinary.com/v1_1/dorbel/auto/upload', formData)
    .then(res => res.data);      
  }
}

module.exports = CloudinaryProvider;

