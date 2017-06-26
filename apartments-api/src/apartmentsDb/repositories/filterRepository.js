'use strict';
const db = require('../dbConnectionProvider');

function create(filter) {
  return db.models.filter.create(filter);
}

function find(where) {
  return db.models.filter.findAll({ where });
}

function getByUser(dorbel_user_id) {
  return find({ dorbel_user_id });
}

function getById(id) {
  return db.models.filter.findById(id);
}

function destroy(id, dorbel_user_id) {
  return db.models.filter.destroy({
    where: { id, dorbel_user_id }
  });
}

module.exports = {
  create,
  find,
  getByUser,
  getById,
  destroy
};
