'use strict';
/**
 * This module will aggregate all the parts of the Swagger API Definition File
 * Will take paths from `paths` sub-folder and (model) definitions from `definitions` sub-folder
 */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function consolidateFilesInFolder(folderName) {
  let folderPath = path.join(__dirname, folderName);
  return fs.readdirSync(folderPath)
    .reduce((fullObj, fileName) => _.extend(fullObj, require(path.join(folderPath, fileName))), {});
}

const swaggerBase = {
  swagger: '2.0',
  info: {
    'title': 'dorbel Notifications Service',
    'description': 'dorbel Service for the notifications domain',
    'version': '0.0.1'
  },
  schemes: [
    'https'
  ],
  basePath: '/v1',
  produces: [
    'application/json'
  ],
  paths: consolidateFilesInFolder('paths'),
  // TODO : can definitions be based on the DB models ?
  definitions: consolidateFilesInFolder('definitions')
};

module.exports = swaggerBase;
