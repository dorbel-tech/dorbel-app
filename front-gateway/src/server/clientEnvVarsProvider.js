'use-strict';

import {getCloudinaryParams} from './cloudinaryConfigProvider';
import _ from 'lodash';

function getClientSideEnvVars() {
  const clientSideEnvVars = _.pick(process.env, ['NODE_ENV', 'AUTH0_FRONT_CLIENT_ID', 'AUTH0_DOMAIN', 'GOOGLE_API_KEY',
    'FRONT_GATEWAY_URL', 'TALKJS_APP_ID', 'TALKJS_PUBLISHABLE_KEY', 'FILESTACK_API_KEY']);
  clientSideEnvVars.CLOUDINARY_PARAMS = getCloudinaryParams();
  
  return clientSideEnvVars;
}

module.exports = {
  getClientSideEnvVars
};
