'use strict';
const listingService = require('../../services/listingService');

function* get() {

  yield messageBus.publish(messageBus.eventType.APARTMENT_CREATED, { apartment_id: 1, user_uuid: '211312-4123123-5344-234234-2343' });
  
  let consumer = messageBus.consume.start(function (message, done) {
    // do some work with `message`
    logger.debug('Message content', message);

    done();
  });

  consumer.stop();
  
  this.response.body = yield listingService.list();
}

function* post() {
  let newApartment = this.request.body;
  newApartment.publishing_user_id = this.request.user.id;
  // TODO : this does find-or-create - we should return an error if the apartment already exists
  let createdApartment = yield listingService.create(newApartment);
  this.response.status = 201;
  this.response.body = createdApartment;
}

module.exports = {
  post: post,
  get: get
};
