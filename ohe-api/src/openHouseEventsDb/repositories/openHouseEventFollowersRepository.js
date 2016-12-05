'use strict';
const db = require('../dbConnectionProvider');
const models = db.models;

function* findFollower(followId) {
  return yield models.follower.findOne({
    where: {
      id: followId,
      is_active: true
    }
  });
}

function* createFollower(eventFollow) {
  return yield models.follower.create(eventFollow);
}

function* updateFollower(eventFollow) {
  return yield eventFollow.update({
    is_active: eventFollow.is_active
  });
}

module.exports = {
  findFollower,
  createFollower,
  updateFollower
};
