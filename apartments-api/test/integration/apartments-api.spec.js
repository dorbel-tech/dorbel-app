'use strict';
describe('/apartments', function () {
  const app = require('../../src/index.js');
  const coSupertest = require('co-supertest');
  const __ = require('hamjest');
  let request;

  before(function* () {
    let server = yield app.bootstrap();
    request = coSupertest.agent(server);
  });

  it('should add apartment and return it', function* () {
    const newApartment = {
      title: 'Best apartment',
      description: 'Really nice place to live',
      street_name: 'Rothschild Boulevard',
      house_number: '129',
      unit: '2'
    };

    yield request.post('/v1/apartments').send(newApartment).expect(201).end();
    const getResponse = yield request.get('/v1/apartments').expect(200).end();
    __.assertThat(getResponse.body, __.allOf(
      __.is(__.array()),
      __.hasItem(__.hasProperties(newApartment))
    ));
  });

  it('should fail to add an apartment without a title', function* () {
    const response = yield request.post('/v1/apartments').send({ description: 'just this' }).expect(400).end();
    __.assertThat(response.body,
      __.hasProperty('details', __.hasItem('title is a required field'))
    );
  });
});
