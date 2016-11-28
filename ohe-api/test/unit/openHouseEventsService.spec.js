'use strict';
const moment = require('moment');
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');

describe('Open House Event Service', function () {

    before(function () {
        this.openHouseEventsRepositoryMock = {};
        mockRequire('../../src/openHouseEventsDb/repositories/openHouseEventsRepository', this.openHouseEventsRepositoryMock);
        this.openHouseEventsService = require('../../src/services/openHouseEventsService');
    });

    after(() => mockRequire.stopAll());

    describe('Find Open House Event', function () {

        it('should finf an existing event (set as not active)', function* () {
            let existingEvent = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours'),
                is_active: false
            };
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(existingEvent);

            let oheId = 1;

            let existingEventtResponse = yield this.openHouseEventsService.find(oheId);
            __.assertThat(existingEvent, __.is(existingEventtResponse));
        });

        it('should fail when event id is not valid', function* () {
            let oheId = 'a';

            try {
                yield this.openHouseEventsService.find(oheId);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event id is not valid'));
            }
        });

        it('should fail when event id does not exists in db', function* () {
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

            let oheId = 1;

            try {
                yield this.openHouseEventsService.find(oheId);
                // __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event does not exist'));
            }
        });
    });

    describe('Create Open House Event', function () {

        it('should create a new event', function* () {
            let newEvent = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-2, 'hours'),
                end_time: moment().add(-1, 'hours'),
                is_active: true
            }


            let ohe = {
                listing_id: newEvent.listing_id,
                start_time: newEvent.start_time.toISOString(),
                end_time: newEvent.end_time.toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

            this.openHouseEventsRepositoryMock.create = sinon.stub().resolves({
                id: 1,
                listing_id: newEvent.listing_id,
                start_time: newEvent.start_time,
                end_time: newEvent.end_time,
                is_active: true
            });

            let savedEvent = yield this.openHouseEventsService.create(ohe);
            __.assertThat(savedEvent, __.is(newEvent));
        });

        it('should fail when listing id is not valid', function* () {
            let ohe = {
                listing_id: 'a'
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
                listing_id: 1,
                start_time: 'aaaaaaa'
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
                listing_id: 1,
                start_time: moment().toISOString(),
                end_time: 'aaaaaa'
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
                listing_id: 1,
                start_time: moment().toISOString(),
                end_time: moment().add(29, 'minutes').toISOString()
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
                listing_id: 1,
                start_time: moment().add(-15, 'hours').toISOString(),
                end_time: moment().add(-5, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([{
                start_time: moment().add(-20, 'hours').toISOString(),
                end_time: moment().add(-10, 'hours').toISOString()
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
                listing_id: 1,
                start_time: moment().add(-25, 'hours').toISOString(),
                end_time: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([{
                start_time: moment().add(-20, 'hours').toISOString(),
                end_time: moment().add(-10, 'hours').toISOString()
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
                listing_id: 1,
                start_time: moment().add(-25, 'hours').toISOString(),
                end_time: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([{
                start_time: moment().add(-20, 'hours').toISOString(),
                end_time: moment().add(-10, 'hours').toISOString()
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([]);

            let updatedEvent = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-2, 'hours'),
                end_time: moment().add(-1, 'hours'),
                is_active: true
            }

            this.openHouseEventsRepositoryMock.update = sinon.stub().resolves({
                id: 1,
                listing_id: updatedEvent.listing_id,
                start_time: updatedEvent.start_time,
                end_time: updatedEvent.end_time,
                is_active: true                
            });

            let ohe = {
                id: updatedEvent.id,
                listing_id: updatedEvent.listing_id,
                start_time: updatedEvent.start_time.toISOString(),
                end_time: updatedEvent.end_time.toISOString()
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

            let updatedEvent = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-2, 'hours'),
                end_time: moment().add(-1, 'hours')
            }

            let ohe = {
                id: updatedEvent.id,
                listing_id: updatedEvent.listing_id,
                start_time: updatedEvent.start_time.toISOString(),
                end_time: updatedEvent.end_time.toISOString()
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 'a'
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 1,
                start_time: 'aaaaaaa'
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 1,
                start_time: moment().toISOString(),
                end_time: 'aaaaaa'
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 1,
                start_time: moment().toISOString(),
                end_time: moment().add(29, 'minutes').toISOString()
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-15, 'hours').toISOString(),
                end_time: moment().add(-5, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([{
                start_time: moment().add(-20, 'hours').toISOString(),
                end_time: moment().add(-10, 'hours').toISOString()
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-25, 'hours').toISOString(),
                end_time: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([{
                start_time: moment().add(-20, 'hours').toISOString(),
                end_time: moment().add(-10, 'hours').toISOString()
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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours')
            });

            let ohe = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-25, 'hours').toISOString(),
                end_time: moment().add(-15, 'hours').toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([{
                start_time: moment().add(-20, 'hours').toISOString(),
                end_time: moment().add(-10, 'hours').toISOString()
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
                listing_id: 1,
                start_time: moment().add(-5, 'hours'),
                end_time: moment().add(-3, 'hours')
            };

            let updatedEvent = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-6, 'hours'),
                end_time: moment().add(-4, 'hours')
            };

            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: existingEvent.id,
                listing_id: existingEvent.listing_id,
                start_time: existingEvent.start_time,
                end_time: existingEvent.end_time
            });

            this.openHouseEventsRepositoryMock.update = sinon.stub().resolves({
                id: updatedEvent.id,
                listing_id: updatedEvent.listing_id,
                start_time: updatedEvent.start_time,
                end_time: updatedEvent.end_time
            });

            let ohe = {
                id: updatedEvent.id,
                listing_id: updatedEvent.listing_id,
                start_time: updatedEvent.start_time.toISOString(),
                end_time: updatedEvent.end_time.toISOString()
            };

            this.openHouseEventsRepositoryMock.findByListingId = sinon.stub().resolves([existingEvent]);
            let savedEvent = yield this.openHouseEventsService.update(ohe);
            __.assertThat(savedEvent, __.is(updatedEvent));
        });
    });

    describe('Remove Open House Event', function () {

        it('should remove an existing event (set as not active)', function* () {
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours'),
                is_active: true
            });

            let deletedEvent = {
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours'),
                is_active: false
            };

            this.openHouseEventsRepositoryMock.update = sinon.stub().resolves(deletedEvent);

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
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

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

    describe('Register To Open House Event', function () {

        it('should register a user to an event', function* () {
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours'),
                is_active: true
            });

            this.openHouseEventsRepositoryMock.register = sinon.stub().resolves(true);

            const oheId = 1;
            const userId = 1;

            const registrationResponse = yield this.openHouseEventsService.register(oheId, userId);
            __.assertThat(registrationResponse, __.is(true));
        });

        it('should fail when the event id a user registers is not valid', function* () {
            let oheId = 'a';

            try {
                yield this.openHouseEventsService.register(oheId);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event id is not valid'));
            }
        });

        it('should fail when the event a user registers does not exists in db', function* () {
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

            let oheId = 1;

            try {
                yield this.openHouseEventsService.register(oheId);
                // __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event does not exist'));
            }
        });
    });

    describe('UnRegister an Open House Event', function () {

        it('should unregister a user from an event', function* () {
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves({
                id: 1,
                listing_id: 1,
                start_time: moment().add(-4, 'hours'),
                end_time: moment().add(-3, 'hours'),
                is_active: true
            });

            this.openHouseEventsRepositoryMock.unregister = sinon.stub().resolves(true);

            const oheId = 1;
            const userId = 1;

            const registrationResponse = yield this.openHouseEventsService.unregister(oheId, userId);
            __.assertThat(registrationResponse, __.is(true));
        });

        it('should fail when the event id a user unregisters is not valid', function* () {
            let oheId = 'a';

            try {
                yield this.openHouseEventsService.unregister(oheId);
                __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event id is not valid'));
            }
        });

        it('should fail when the event a user unregisters does not exists in db', function* () {
            this.openHouseEventsRepositoryMock.find = sinon.stub().resolves(null);

            let oheId = 1;

            try {
                yield this.openHouseEventsService.unregister(oheId);
                // __.assertThat('code', __.is('not reached'));
            }
            catch (error) {
                __.assertThat(error.message, __.is('event does not exist'));
            }
        });
    });
});
