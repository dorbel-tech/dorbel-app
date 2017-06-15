'use strict';
const db = require('../dbConnectionProvider');

function create(filter) {
  return db.models.filter.create(filter);
}

function getByUser(dorbel_user_id) {
  return db.models.filter.findAll({
    where: { dorbel_user_id },
    raw: true
  });
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
  getByUser,
  getById,
  destroy
};
