'use strict';
describe('/apartments', function () {
  const app = require('../../src/index.js');
  const coSupertest = require('co-supertest');
  const __ = require('hamjest');
  const _ = require('lodash');
  let request;

  before(function* () {
    try {
      let server = yield app.bootstrap();
      request = coSupertest.agent(server);
    }
    catch (err) {
      if (err.code === 'EADDRINUSE') { // server is already up
        request = coSupertest('localhost:' + err.port);
      } else {
        throw err;
      }
    }
  });

  it('should add apartment and return it', function* () {
    const newApartment = {
      country_name: 'Israel',
      city_name: 'תל אביב',
      neighborhood_name: 'מרכז העיר',
      street_name: 'Rothschild Boulevard',
      house_number: '129',
      unit: '2',
      rooms: 3,
      floor: 4,
      size: 45,
      title: 'Best apartment',
      description: 'Really nice place to live',
    };

    yield request.post('/v1/listings').send(newApartment).expect(201).end();
    const getResponse = yield request.get('/v1/apartments').expect(200).end();
    const expected = _.pick(newApartment, ['street_name', 'house_number', 'unit']);
    __.assertThat(getResponse.body, __.allOf(
      __.is(__.array()),
      __.hasItem(__.hasProperties(expected))
    ));
  });

  it('should fail to add an apartment without a title', function* () {
    const response = yield request.post('/v1/listings').send({ description: 'just this' }).expect(400).end();
    __.assertThat(response.body,
      __.hasProperty('details', __.hasItem('title is a required field'))
    );
  });
});
