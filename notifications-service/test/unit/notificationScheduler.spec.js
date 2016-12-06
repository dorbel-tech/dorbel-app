'use strict';
describe('Notification Scheduler', function() {
  const __ = require('hamjest');
  const _ = require('lodash');
  const sinon = require('sinon');
  const mockRequire = require('mock-require');
  const moment = require('moment');
  const timeKeeper = require('timekeeper');
  const promisify = require('es6-promisify');

  const notificationRepositoryMock = {
    create: sinon.stub().resolves()
  };

  const simpleEvent = {
    eventType: 'SIMPLE_EVENT',
    notificationType: 'simple-notification',
    relatedObjectType: 'apartment'
  }; 

  const delayedEvent = {
    eventType: 'DELAYED_EVENT',
    delay: 45,
    relatedObjectType: 'apartment'
  };

  const delayedRelativeEvent = {
    eventType: 'DELAYED_RELATIVE_TO',
    delay: -2,
    delayRelativeTo: 'relative_to',
    relatedObjectType: 'apartment'
  };

  const multipleEvent1 = {
    eventType: 'MULTIPLE_EVENT',
    notificationType: 'multi1',
    relatedObjectType: 'apartment'
  };

  const multipleEvent2 = {
    eventType: 'MULTIPLE_EVENT',
    notificationType: 'multi2',
    relatedObjectType: 'apartment'
  };

  const dataPayload = {
    apartment_id: 123,
    user_uuid: 456
  };

  before(function() {
    mockRequire('../../src/notificationDb/notificationRepository', notificationRepositoryMock);
    mockRequire('../../src/scheduler/eventConfigurations.json', [
      simpleEvent,
      delayedEvent,
      delayedRelativeEvent,
      multipleEvent1,
      multipleEvent2
    ]);
    timeKeeper.freeze(new Date());

    const scheduler = require('../../src/scheduler/notificationScheduler');
    this.handleMessage = function(message) {
      message.dataPayload = _.extend({}, dataPayload, message.dataPayload);
      return promisify(scheduler.handleMessage)({
        Body: JSON.stringify({ Message: JSON.stringify(message) }) 
      });      
    };
    
  });

  afterEach(() => notificationRepositoryMock.create.reset());

  after(() => {
    timeKeeper.reset();
    mockRequire.stopAll();
  });

  it('should schedule a simple event', function* () {
    yield this.handleMessage({ eventType: simpleEvent.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0],
      __.hasProperties({ notificationType: simpleEvent.notificationType, scheduledTo: new Date() }) 
    );
  });


  it('should create event with related object id', function*() {
    yield this.handleMessage({ eventType: simpleEvent.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0],
      __.hasProperties({ relatedObjectId: dataPayload.apartment_id, relatedObjectType: simpleEvent.relatedObjectType }) 
    );
  });

  it('should schedule a delayed event to the correct time', function* () {
    yield this.handleMessage({ eventType: delayedEvent.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0],
      __.hasProperty('scheduledTo', moment().add(delayedEvent.delay, 'hours').toDate() )
    );
  });

  it('should schedule multiple notifications for same event', function* () {
    yield this.handleMessage({ eventType: multipleEvent1.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0], // first call
      __.hasProperty('notificationType', multipleEvent1.notificationType)
    );
    __.assertThat(notificationRepositoryMock.create.args[1][0], // second call
      __.hasProperty('notificationType', multipleEvent2.notificationType)
    );
  });

  it('should schedule delayed-relative-to with correct time', function* () {
    const relativeTo = moment().add(3, 'days');
    yield this.handleMessage({ 
      eventType: delayedRelativeEvent.eventType, 
      dataPayload : { relative_to: relativeTo.toISOString() } 
    });    
    __.assertThat(notificationRepositoryMock.create.args[0][0], 
      __.hasProperty('scheduledTo', relativeTo.add(delayedRelativeEvent.delay, 'hours').toDate())
    );
  });

  it('should not schedule if delay-relative-to-field is not supplied', function* () {
    yield this.handleMessage({ eventType: delayedRelativeEvent.eventType });    
    __.assertThat(notificationRepositoryMock.create.args.length, __.is(0));
  });

});
