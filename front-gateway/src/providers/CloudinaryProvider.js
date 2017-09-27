'use strict';
import axios from 'axios';
import _ from 'lodash';

const baseUrl = 'https://api.cloudinary.com/v1_1/dorbel/';

class CloudinaryProvider {
  constructor() {
    // will only work on client side
    this.params = global.window && global.window.dorbelConfig.CLOUDINARY_PARAMS;
  }

  upload(file, onUploadProgress) {
    let formData = new FormData();
    _.each(this.params, (value, key) => formData.append(key, value));
    formData.append('file', file);

    return axios.post(baseUrl + 'image/upload', formData, { onUploadProgress })
      .then(res => res.data);
  }

  deleteImage(image) {
    // TODO: when editing existing images (uploaded in previous sessions) - we don't have delete token and can't delete from cloudinary
    if (image.delete_token) {
      return axios.post(baseUrl + 'delete_by_token', { token: image.delete_token });
    }
  }
}

module.exports = CloudinaryProvider;

