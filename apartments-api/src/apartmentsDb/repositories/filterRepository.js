'use strict';
const db = require('../dbConnectionProvider');
const filterModel = db.models.filter;

function create(filter) {
  return filterModel.create(filter);
}

function find(where) {
  return filterModel.findAll({ where });
}

function getByUser(dorbel_user_id) {
  return find({ dorbel_user_id });
}

function getById(id) {
  return filterModel.findById(id);
}

function destroy(id, dorbel_user_id) {
  return filterModel.destroy({
    where: { id, dorbel_user_id }
  });
}

function updateEmailNotification(email_notification, dorbel_user_id) {
  if (!dorbel_user_id) {
    return;
  }
  return filterModel.update(
    { email_notification },
    {
      where: { dorbel_user_id },
      validate: false // validation fails batch updates and here we only update one field which is not validated anyway
    }
  );
}

module.exports = {
  create,
  find,
  getByUser,
  getById,
  destroy,
  updateEmailNotification
};
