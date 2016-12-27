'use strict';
describe('Notification Sender', function() {
  const _ = require('lodash');
  const __ = require('hamjest');
  const sinon = require('sinon');
  const promisify = require('es6-promisify');
  const mockRequire = require('mock-require');
  const shared = require('dorbel-shared');

  const segmentClientMock = sinon.spy(shared.utils.analytics, 'track');

  const dataRetrievalMock = {
    getAdditonalData: sinon.stub().resolves({})
  };

  const simpleEvent = {
    eventType: 'SIMPLE_EVENT',
    notificationType: 'user did something really simple',
  };

  const multipleEvent1 = {
    eventType: 'MULTI_EVENT',
    notificationType: 'this should be sent',
  };

  const multipleEvent2 = {
    eventType: 'MULTI_EVENT',
    notificationType: 'this should also be sent',
  };

  const eventWithDataRetrieval = {
    eventType: 'GET_MORE_DATA',
    notificationType: 'this should be sent with additonal data',
    dataRetrieval: [ 'get some more data ']
  };

  const defaultEventPayload = {
    apartment_id: 123,
    user_uuid: 456
  };

  before(function() {
    mockRequire('../../src/sender/dataRetrieval', dataRetrievalMock);
    mockRequire('../../src/sender/eventConfigurations.json', [
      simpleEvent, multipleEvent1, multipleEvent2, eventWithDataRetrieval
    ]);
    const sender = require('../../src/sender/notificationSender');
    this.handleMessage = function(message) {
      message.dataPayload = _.extend({}, defaultEventPayload, message.dataPayload);
      return promisify(sender.handleMessage)({
        Body: JSON.stringify({ Message: JSON.stringify(message) }) 
      });      
    };
  });

  afterEach(() => {
    segmentClientMock.reset();
    dataRetrievalMock.getAdditonalData.reset();
  });

  after(() => mockRequire.stopAll());

  it('should schedule a simple event', function* () {
    yield this.handleMessage({ eventType: simpleEvent.eventType });
    __.assertThat(segmentClientMock.args[0], __.contains(
      __.is(defaultEventPayload.user_uuid),
      __.is(simpleEvent.notificationType),
      __.hasProperties(defaultEventPayload)
    ));
  });
  
  it('should schedule multiple notifications for same event', function* () {
    yield this.handleMessage({ eventType: multipleEvent1.eventType });
    __.assertThat(segmentClientMock.args[0][1], // first call second argument
      __.is(multipleEvent1.notificationType)
    );
    __.assertThat(segmentClientMock.args[1][1], // second call second argument
      __.is(multipleEvent2.notificationType)
    );
  });


  it('should get data from data retrivel and send in message', function* () {
    const extraData = { fried: 'bacon' };
    dataRetrievalMock.getAdditonalData = sinon.stub().resolves(extraData);
    yield this.handleMessage({ eventType: eventWithDataRetrieval.eventType });
    __.assertThat(segmentClientMock.args[0][2], // first call third argument 
      __.hasProperties(extraData)
    );
  });

  it('should call data retrivel functions with event data', function* () {
    const event = { eventType: eventWithDataRetrieval.eventType, dataPayload: { boiled: 'cabbage' }};
    yield this.handleMessage(event);
    __.assertThat(dataRetrievalMock.getAdditonalData.args[0], __.contains(
      __.is(eventWithDataRetrieval),
      __.is(event.dataPayload)
    ));
  });
  
});
