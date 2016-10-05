'use strict';
var app = require('../../src/server/server.js');
var request = require('co-supertest').agent(app.listen());
var __ = require('hamjest');

describe('/apartments', function () {
  it('should add apartment and return it', function* () {
    const newApartment = { 'title': 'Best apartment', 'description': 'Really nice place to live' };
    yield request.post('/v1/apartments').send(newApartment).expect(201).end();
    var getResponse = yield request.get('/v1/apartments').expect(200).end();

    __.assertThat(getResponse.body, __.allOf(
      __.is(__.array()),
      __.hasItem(newApartment)
    ));
  });

  it('should fail to add an apartment without a title', function* () {
    yield request.post('/v1/apartments').send({ description: 'just this' }).expect(400).end();
  });
});
