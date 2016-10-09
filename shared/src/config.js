'use strict';
const nconf = require('nconf');
const path = require('path');

let config = nconf
  .argv() // command line args are top priority
  .env(); // environment vars are 2nd priority

function setConfigFileFolder(folder) {
  const environmentConfigFile = path.join(folder, process.env.NODE_ENV + '.json');
  const sharedConfigFile = path.join(folder, 'shared.json');
  config = config
    .file('env-file', environmentConfigFile) // files are last in the priority
    .file('shared-file', sharedConfigFile ); // shared file comes last
}

function get(key) {
  return config.get(key);
}

module.exports = {
  setConfigFileFolder,
  get: get
};
