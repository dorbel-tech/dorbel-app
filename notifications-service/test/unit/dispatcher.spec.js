describe('Dispatcher', function() {
  const __ = require('hamjest');
  const _ = require('lodash');
  const promisify = require('es6-promisify');
  const sinon = require('sinon');
  const mockRequire = require('mock-require');

  const transportMock = {
    send: sinon.stub().resolves()
  };

  const mockData = { stuff: 12378 };

  const dataRetrievalMock = {
    getDataForNotification: sinon.stub().resolves(mockData)    
  };

  before(function() {
    mockRequire('../../src/sender/dataRetrieval', dataRetrievalMock);
    mockRequire('../../src/sender/dispatchers/emailDispatcher', transportMock);
    mockRequire('../../src/sender/dispatchers/smsDispatcher', transportMock);

    const dispatcher = require('../../src/sender/dispatcher');
    this.handleMessage = function(message) {
      // message.dataPayload = _.extend({}, dataPayload, message.dataPayload);
      return promisify(dispatcher.handleMessage)('email', {
        Body: JSON.stringify(message) 
      });
    };
  });

  afterEach(() => {
    dataRetrievalMock.getDataForNotification.reset();
  });

  after(() => mockRequire.stopAll());

  it('should get data from data retrivel and send in message', function* () {
    yield this.handleMessage({});
    __.assertThat(transportMock.send.args[0][0], 
      __.hasProperties(mockData)
    );
  });

  it('should call data retrivel functions with event data', function* () {
    const eventData = { notificationType: 'bla', test: 918734 };
    yield this.handleMessage(eventData);
    __.assertThat(dataRetrievalMock.getDataForNotification.args[0][0], __.is(eventData));
  });

});

