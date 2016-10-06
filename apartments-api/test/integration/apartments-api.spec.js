'use strict';
describe('/apartments', function () {
  const app = require('../../src/server/server.js');
  const request = require('co-supertest').agent(app.listen());
  const __ = require('hamjest');

  it('should add apartment and return it', function* () {
    const newApartment = { 'title': 'Best apartment', 'description': 'Really nice place to live' };

    yield request.post('/v1/apartments').send(newApartment).expect(201).end();
    const getResponse = yield request.get('/v1/apartments').expect(200).end();
    __.assertThat(getResponse.body, __.allOf(
      __.is(__.array()),
      __.hasItem(newApartment)
    ));
  });

  it('should fail to add an apartment without a title', function* () {
    const response = yield request.post('/v1/apartments').send({ description: 'just this' }).expect(400).end();
    __.assertThat(response.body,
      __.hasProperty('details', __.hasItem('title is a required field'))
    );
  });
});
