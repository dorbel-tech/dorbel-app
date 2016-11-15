'use strict';
/**
 * This will serve the client with the cloudinary configuration
 * It happens everytime a client requests the application since the timestamp needs to be valid
 */
import crypto from 'crypto';
import _ from 'lodash';
import shared from 'dorbel-shared';

const logger = shared.logger.getLogger(module);
const config = shared.config;

const defaultParams = {
  upload_preset: 'default',
  return_delete_token: '1',
  tags: 'directly_uploaded'
};

function getCloudinaryParams() {
  var paramsToSign = _.clone(defaultParams);
  paramsToSign.timestamp = (Date.now() / 1000 | 0);
  const toSign = Object.keys(paramsToSign).sort().map(key => `${key}=${paramsToSign[key]}`).join('&');

  let shasum = crypto.createHash('sha1');
  shasum.update(toSign + config.get('CLOUDINARY_SECRET'));

  paramsToSign.signature = shasum.digest('hex');
  paramsToSign.api_key = config.get('CLOUDINARY_API_KEY');
  return paramsToSign;
}

if (!config.get('CLOUDINARY_SECRET') || !config.get('CLOUDINARY_API_KEY')) {
  logger.error('Missing cloudinary config params, cloudinary will not work');
}

module.exports = {
  getCloudinaryParams
};
