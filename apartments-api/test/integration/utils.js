const _ = require('lodash');

const userIds = {
  // Integration tests run with static ID as they fill the message queue with app-events
  INTEGRATION_TEST_USER_ID: '36a204fa-41b7-4c87-a759-f8a449abadb8',
  OTHER_INTEGRATION_TEST_USER_ID: '40031759-daa4-4b5d-ad69-5f7760894c80',
  ADMIN_INTEGRATION_TEST_USER_ID: 'ecdf7910-2055-4553-9ccd-d730e1e4e73e',
};

function* clearAllUserLikes(apiClient) {
  const existingLikesResponse = yield apiClient.getUserLikes().expect(200).end();

  for (let i = 0; i < existingLikesResponse.body.length; i++) {
    let userLike = existingLikesResponse.body[i];
    yield apiClient.unlikeApartment(userLike.apartment_id, userLike.listing_id).expect(200).end();
  }
}

function* cleanDb() {
  if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() != 'production') {
    const db = require('../../src/apartmentsDb/dbConnectionProvider');
    yield db.connect();

    const aptIdsToDelete = yield db.models.listing.findAll({
      raw: true,
      attributes: ['apartment_id'],
      include: [
        {
          model: db.models.apartment,
          attributes: ['building_id']
        }
      ],
      where: {
        publishing_user_id: {
          $in: _.values(userIds)
        }
      }
    });

    yield db.models.apartment.destroy({
      where: {
        id: {
          $in: _.map(aptIdsToDelete, 'apartment_id')
        }
      }
    });

    yield db.models.building.destroy({
      where: {
        id: {
          $in: _.map(aptIdsToDelete, 'apartment.building_id')
        }
      }
    });
  }
}

module.exports = {
  clearAllUserLikes,
  userIds,
  cleanDb
};
