'use strict';
const db = require('../dbConnectionProvider');
const documentModel = db.models.document;

function create(document) {
  return documentModel.create(document);
}

function find(where) {
  return documentModel.findAll({ where });
}

function findById(id) {
  return documentModel.findById(id);
}

function destroy(id) {
  return documentModel.destroy({
    where: { id }
  });
}

module.exports = {
  create,
  find,
  findById,
  destroy
};
