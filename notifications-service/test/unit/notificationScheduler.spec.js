'use strict';
describe('Notification Scheduler', function() {
  const __ = require('hamjest');
  const sinon = require('sinon');
  const mockRequire = require('mock-require');
  const moment = require('moment');
  const timeKeeper = require('timekeeper');

  const notificationRepositoryMock = {
    create: sinon.stub().resolves()
  };

  const simpleEvent = {
    eventType: 'SIMPLE_EVENT',
    notificationType: 'simple-notification',
    relatedObjectType: ''
  }; 

  const delayedEvent = {
    eventType: 'DELAYED_EVENT',
    delay: 45
  };

  const delayedRelativeEvent = {
    eventType: 'DELAYED_RELATIVE_TO',
    delay: -2,
    delayRelativeTo: 'relative_to'
  };

  const multipleEvent1 = {
    eventType: 'MULTIPLE_EVENT',
    notificationType: 'multi1'
  };

  const multipleEvent2 = {
    eventType: 'MULTIPLE_EVENT',
    notificationType: 'multi2'
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

    this.scheduler = require('../../src/scheduler/notificationScheduler');
  });

  afterEach(() => notificationRepositoryMock.create.reset());

  after(() => {
    timeKeeper.reset();
    mockRequire.stopAll();
  });

  it('should schedule a simple event', function* () {
    yield this.scheduler.handleMessage({ eventType: simpleEvent.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0],
      __.hasProperties({ notificationType: simpleEvent.notificationType, status: 'pending', scheduledTo: new Date() }) 
    );
  });


  it('should create event with related object id', function*() {
    yield this.scheduler.handleMessage({ eventType: delayedRelativeEvent.eventType });


  });

  it('should schedule a delayed event to the correct time', function* () {
    yield this.scheduler.handleMessage({ eventType: delayedEvent.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0],
      __.hasProperty('scheduledTo', moment().add(delayedEvent.delay, 'hours').toDate() )
    );
  });

  it('should schedule multiple notifications for same event', function* () {
    yield this.scheduler.handleMessage({ eventType: multipleEvent1.eventType });
    __.assertThat(notificationRepositoryMock.create.args[0][0], // first call
      __.hasProperty('notificationType', multipleEvent1.notificationType)
    );
    __.assertThat(notificationRepositoryMock.create.args[1][0], // second call
      __.hasProperty('notificationType', multipleEvent2.notificationType)
    );
  });

  it('should schedule delayed-relative-to with correct time', function* () {
    const relativeTo = moment().add(3, 'days');
    yield this.scheduler.handleMessage({ eventType: delayedRelativeEvent.eventType, relative_to: relativeTo.toISOString() });    
    __.assertThat(notificationRepositoryMock.create.args[0][0], 
      __.hasProperty('scheduledTo', relativeTo.add(delayedRelativeEvent.delay, 'hours').toDate())
    );
  });

  it('should not schedule if delay-relative-to-field is not supplied', function* () {
    yield this.scheduler.handleMessage({ eventType: delayedRelativeEvent.eventType });    
    __.assertThat(notificationRepositoryMock.create.args.length, __.is(0));
  });

});
