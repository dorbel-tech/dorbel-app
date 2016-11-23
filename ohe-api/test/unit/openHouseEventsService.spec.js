'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');

describe('Open House Event Service', function () {

    before(function () {
        this.mockOpenHouseEvent = {};
        this.openHouseEventsRepositoryMock = {
            create: sinon.stub().resolves(this.mockListing)
        };
        mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
        this.openHouseEventsService = require('../../src/services/openHouseEventsService');
    });

    after(() => mockRequire.stopAll());

    describe('Create Open House Event', function () {

        it('should create a new event', function* () {
            let newEvent = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-2, 'hours'),
                endTime: moment().add(-1, 'hours'),
                isActive: true
            }


            let ohe = {
                listingId: newEvent.listingId,
                startTime: newEvent.startTime.toISOString(),
                endTime: newEvent.endTime.toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([]);

            this.openHouseEventsRepositoryMock.create = sinon.stub().resolves({
                id: 1,
                listingId: newEvent.listingId,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                isActive: true
            });

            let savedEvent = yield this.openHouseEventsService.create(ohe);
            __.assertThat(savedEvent, __.is(newEvent));
        });

        it('should fail when listing id is not valid', function* () {
            let ohe = {
                listingId: 'a'
            };

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('listing id is not valid'));
            }
        });

        it('should fail when start time is not valid', function* () {
            let ohe = {
                listingId: 1,
                startTime: 'aaaaaaa'
            };

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('start time is not valid'));
            }
        });

        it('should fail when end time is not valid', function* () {
            let ohe = {
                listingId: 1,
                startTime: moment().toISOString(),
                endTime: 'aaaaaa'
            };

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('end time is not valid'));
            }
        });

        it('should fail when end time is less than 30 minutes after start time', function* () {
            let ohe = {
                listingId: 1,
                startTime: moment().toISOString(),
                endTime: moment().add(29, 'minutes').toISOString()
            };

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
            }
        });

        it('should fail new event is overlapping existing events (starts during an existing event)', function* () {
            let ohe = {
                listingId: 1,
                startTime: moment().add(-15, 'hours').toISOString(),
                endTime: moment().add(-5, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([{
                startTime: moment().add(-20, 'hours').toISOString(),
                endTime: moment().add(-10, 'hours').toISOString()
            }]);

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('new event is overlapping an existing event'));
            }
        });

        it('should fail new event is overlapping existing events (ends during an existing event)', function* () {
            let ohe = {
                listingId: 1,
                startTime: moment().add(-25, 'hours').toISOString(),
                endTime: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([{
                startTime: moment().add(-20, 'hours').toISOString(),
                endTime: moment().add(-10, 'hours').toISOString()
            }]);

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('new event is overlapping an existing event'));
            }
        });

        it('should fail new event is overlapping existing events (happens during an existing event)', function* () {
            let ohe = {
                listingId: 1,
                startTime: moment().add(-25, 'hours').toISOString(),
                endTime: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([{
                startTime: moment().add(-20, 'hours').toISOString(),
                endTime: moment().add(-10, 'hours').toISOString()
            }]);

            try {
                yield this.openHouseEventsService.create(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('new event is overlapping an existing event'));
            }
        });
    });

    describe('Update Open House Event', function () {

        it('should update an existing event', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([]);

            let updatedEvent = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-2, 'hours'),
                endTime: moment().add(-1, 'hours'),
                isActive: true
            }

            this.openHouseEventsRepositoryMock.update = sinon.stub().resolves({
                id: 1,
                listingId: updatedEvent.listingId,
                startTime: updatedEvent.startTime,
                endTime: updatedEvent.endTime,
                isActive: true                
            });

            let ohe = {
                id: updatedEvent.id,
                listingId: updatedEvent.listingId,
                startTime: updatedEvent.startTime.toISOString(),
                endTime: updatedEvent.endTime.toISOString()
            };

            let savedEvent = yield this.openHouseEventsService.update(ohe);
            __.assertThat(savedEvent, __.is(updatedEvent));
        });

        it('should fail when updated event id is not valid', function* () {
            let ohe = {
                id: 'a'
            };

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event id is not valid'));
            }
        });

        it('should fail when updated event id does not exists in db', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves(null);

            let updatedEvent = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-2, 'hours'),
                endTime: moment().add(-1, 'hours')
            }

            let ohe = {
                id: updatedEvent.id,
                listingId: updatedEvent.listingId,
                startTime: updatedEvent.startTime.toISOString(),
                endTime: updatedEvent.endTime.toISOString()
            };

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event does not exist'));
            }
        });

        it('should fail when listing id is not valid', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 'a'
            };


            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('listing id is not valid'));
            }
        });

        it('should fail when start time is not valid', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 1,
                startTime: 'aaaaaaa'
            };

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('start time is not valid'));
            }
        });

        it('should fail when end time is not valid', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 1,
                startTime: moment().toISOString(),
                endTime: 'aaaaaa'
            };

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('end time is not valid'));
            }
        });

        it('should fail when end time is less than 30 minutes after start time', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 1,
                startTime: moment().toISOString(),
                endTime: moment().add(29, 'minutes').toISOString()
            };

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('open house event should be at least 30 minutes'));
            }
        });

        it('should fail updated event is overlapping existing events (starts during an existing event)', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-15, 'hours').toISOString(),
                endTime: moment().add(-5, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([{
                startTime: moment().add(-20, 'hours').toISOString(),
                endTime: moment().add(-10, 'hours').toISOString()
            }]);

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('new event is overlapping an existing event'));
            }
        });

        it('should fail updated event is overlapping existing events (ends during an existing event)', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-25, 'hours').toISOString(),
                endTime: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([{
                startTime: moment().add(-20, 'hours').toISOString(),
                endTime: moment().add(-10, 'hours').toISOString()
            }]);

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('new event is overlapping an existing event'));
            }
        });

        it('should fail updated event is overlapping existing events (happens during an existing event)', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-25, 'hours').toISOString(),
                endTime: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([{
                startTime: moment().add(-20, 'hours').toISOString(),
                endTime: moment().add(-10, 'hours').toISOString()
            }]);

            try {
                yield this.openHouseEventsService.update(ohe);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('new event is overlapping an existing event'));
            }
        });

        it('should exclude the updated event when checking for overlap', function* () {
            let existingEvent = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-5, 'hours'),
                endTime: moment().add(-3, 'hours')
            };

            let updatedEvent = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-6, 'hours'),
                endTime: moment().add(-4, 'hours')
            };

            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: existingEvent.id,
                listingId: existingEvent.listingId,
                startTime: existingEvent.startTime,
                endTime: existingEvent.endTime
            });

            this.openHouseEventsRepositoryMock.update = sinon.stub().resolves({
                id: updatedEvent.id,
                listingId: updatedEvent.listingId,
                startTime: updatedEvent.startTime,
                endTime: updatedEvent.endTime
            });

            let ohe = {
                id: updatedEvent.id,
                listingId: updatedEvent.listingId,
                startTime: updatedEvent.startTime.toISOString(),
                endTime: updatedEvent.endTime.toISOString()
            };

            this.openHouseEventsRepositoryMock.eventsForListing = sinon.stub().resolves([existingEvent]);
            let savedEvent = yield this.openHouseEventsService.update(ohe);
            __.assertThat(savedEvent, __.is(updatedEvent));
        });
    });

    describe('Remove Open House Event', function () {

        it('should remove an existing event (set as not active)', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves({
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours'),
                isActive: true
            });

            let deletedEvent = {
                id: 1,
                listingId: 1,
                startTime: moment().add(-4, 'hours'),
                endTime: moment().add(-3, 'hours'),
                isActive: false
            };

            this.openHouseEventsRepositoryMock.delete = sinon.stub().resolves(deletedEvent);

            let oheId = 1;

            let deleteEventResponse = yield this.openHouseEventsService.remove(oheId);
            __.assertThat(deletedEvent, __.is(deleteEventResponse));
        });

        it('should fail when deleted event id is not valid', function* () {
            let oheId = 'a';

            try {
                yield this.openHouseEventsService.remove(oheId);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event id is not valid'));
            }
        });

        it('should fail when deleted event id does not exists in db', function* () {
            this.openHouseEventsRepositoryMock.get = sinon.stub().resolves(null);

            let oheId = 1;

            try {
                yield this.openHouseEventsService.remove(oheId);
                // __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event does not exist'));
            }
        });
    });
});
