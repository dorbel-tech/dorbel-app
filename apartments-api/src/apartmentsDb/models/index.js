'use strict';
const fs = require('fs');
const path = require('path');

function load(sequelize) {
  let models = {};

  // load models
  fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

  // associate relationships
  Object.keys(models)
    .filter(modelName => 'associate' in models[modelName])
    .forEach(modelName => models[modelName].associate(models));

  return models;
}

module.exports = {
  load
};
