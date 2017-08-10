'use strict';
const db = require('../dbConnectionProvider');

function set(apartmentId, listingId, userId, isLiked) {
  return db.models.like.upsert({
    apartment_id: apartmentId,
    listing_id: listingId,
    liked_user_id: userId,
    is_active: isLiked
  });
}

function getUserLikes(user) {
  return db.models.like.findAll({
    where: {
      liked_user_id: user.id,
      is_active: true
    },
    attributes: ['apartment_id', 'listing_id'],
    raw: true
  });
}

function findByListingId(listingId) {
  return db.models.like.findAll({
    where: {
      listing_id: listingId,
      is_active: true
    }
  });
}

function findByApartmentId(apartmentId) {
  return db.models.like.findAll({
    where: {
      apartment_id: apartmentId,
      is_active: true
    }
  });
}

function getApartmentTotalLikes(apartmentId) {
  return db.models.like.count({
    where: {
      apartment_id: apartmentId,
      is_active: true
    },
    raw: true
  });
}

module.exports = {
  getUserLikes,
  getApartmentTotalLikes,
  findByListingId,
  findByApartmentId,
  set
};
