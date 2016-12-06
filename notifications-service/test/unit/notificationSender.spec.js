'use strict';
describe('Notification Sender', function() {
  const _ = require('lodash');
  const __ = require('hamjest');
  const sinon = require('sinon');
  const mockRequire = require('mock-require');

  const sqsProducerMock = {
    send: sinon.stub().resolves()
  };

  const regularNotification = {
    notificationType: 'regular-notif',
    medium: 'dove', 
    templateName: '5AB4G',
    dataRetrieval: [ 'getData' ]  
  };

  before(function() {
    mockRequire('../../src/sender/sqsProducer', sqsProducerMock); 
    mockRequire('../../src/sender/notificationConfiguration.json', [ regularNotification ]);
    const sender = require('../../src/sender/notificationSender');
    this.handleNotificationEvent = function (event) {
      return sender.handleNotificationEvent(_.extend({ id: 1}, event));
    };
  });

  afterEach(() => {
    sqsProducerMock.send.reset();
  });

  after(() => mockRequire.stopAll());

  it('should send message to sqs according to medium', function* () {
    yield this.handleNotificationEvent({ notificationType: regularNotification.notificationType });
    __.assertThat(sqsProducerMock.send.args[0][0], __.is(regularNotification.medium)); 
    __.assertThat(JSON.parse(sqsProducerMock.send.args[0][1].body), 
      __.hasProperties(regularNotification)
    );
  });

});
