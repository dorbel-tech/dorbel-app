'use strict';
describe('Notification Sender', function() {
  const __ = require('hamjest');
  const sinon = require('sinon');
  const mockRequire = require('mock-require');

  const sqsProducerMock = {
    send: sinon.stub().resolves()
  };

  const mockData = { stuff: 12378 };

  const dataRetrivelMock = {
    getData: sinon.stub().resolves(mockData)
  };

  const regularNotification = {
    notificationType: 'regular-notif',
    medium: 'dove', 
    templateName: '5AB4G',
    dataRetrivel: [ 'getData' ]  
  };

  before(function() {
    mockRequire('../../src/scheduler/sqsProducer', sqsProducerMock); 
    mockRequire('../../src/scheduler/dataRetrivel', dataRetrivelMock);
    mockRequire('../../src/scheduler/notificationConfiguration.json', [ regularNotification ]);
    this.sender = require('../../src/scheduler/notificationSender');
  });

  afterEach(() => {
    sqsProducerMock.send.reset();
    dataRetrivelMock.getData.reset();
  });

  after(() => mockRequire.stopAll());

  it('should send message to sqs according to medium', function* () {
    yield this.sender.handleNotificationEvent({ notificationType: regularNotification.notificationType });
    __.assertThat(sqsProducerMock.send.args[0][0], __.is(regularNotification.medium)); 
    __.assertThat(sqsProducerMock.send.args[0][1], 
      __.hasProperties(regularNotification)
    );
  });

  it('should get data from data retrivel and send in message', function* () {
    yield this.sender.handleNotificationEvent({ notificationType: regularNotification.notificationType });
    __.assertThat(sqsProducerMock.send.args[0][1], 
      __.hasProperties(mockData)
    );
  });

  it('should call data retrivel functions with event data', function* () {
    const eventData = { notificationType: regularNotification.notificationType, test: 918734 };
    yield this.sender.handleNotificationEvent(eventData);
    __.assertThat(dataRetrivelMock.getData.args[0][0], __.is(eventData));
  });

});
