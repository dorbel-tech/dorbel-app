'use strict';
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const moment = require('moment');
const momentRange = require('moment-range');

function OpenHouseEventValidationError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}

function isValidNumber(value) {
    return Number.isInteger(value);
}

function isValidDate(date) {
    return date.isValid();
}

function validateEventParamters(listing_id, start, end) {
    // TODO:  make sure listing exists (call apartements API).
    // For now just make sure listing id is provided
    if (!isValidNumber(listing_id)) {
        throw new OpenHouseEventValidationError('listing id is not valid');
    }
    if (!isValidDate(start)) {
        throw new OpenHouseEventValidationError('start time is not valid');
    }
    if (!isValidDate(end)) {
        throw new OpenHouseEventValidationError('end time is not valid');
    }

    if (end.diff(start, 'minutes') < 30) {
        throw new OpenHouseEventValidationError('open house event should be at least 30 minutes');
    }
}

function validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end) {
    if (!existingListingEvents) return;
    existingListingEvents.forEach(function (existingEvent) {
        const range = moment.range(existingEvent.start_time, existingEvent.end_time);
        if (range.contains(start) || range.contains(end)) {
            throw new OpenHouseEventValidationError('new event is overlapping an existing event');
        }
    });
}

function* find(eventId) {
    const id = parseInt(eventId);
    if (!isValidNumber(id)) {
        throw new OpenHouseEventValidationError('event id is not valid');
    }

    const existingEvent = yield openHouseEventsRepository.find(id);
    if (existingEvent == undefined) {
        throw new OpenHouseEventValidationError('event does not exist');
    }

    return existingEvent;
}

function* create(openHouseEvent) {

    const listing_id = parseInt(openHouseEvent.listing_id);
    const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
    const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);

    validateEventParamters(listing_id, start, end);

    const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
    validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end);

    return yield openHouseEventsRepository.create({
        start_time: start,
        end_time: end,
        listing_id: listing_id,
        is_active: true
    });
}

function* update(openHouseEvent) {
    let existingEvent = yield find(openHouseEvent.id);

    const listing_id = parseInt(openHouseEvent.listing_id);
    const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
    const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);
    validateEventParamters(listing_id, start, end);

    const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
    const existingEventsWithoutCurrent = existingListingEvents.filter(function (existingEvent) {
        return existingEvent.id != openHouseEvent.id;
    });

    validateEventIsNotNotOverlappingExistingEvents(existingEventsWithoutCurrent, listing_id, start, end);

    existingEvent.start_time = start;
    existingEvent.start_time = end;

    return yield openHouseEventsRepository.update(existingEvent);
}

function* remove(eventId) {
    let existingEvent = yield find(eventId);
    existingEvent.is_active = false;
    return yield openHouseEventsRepository.update(existingEvent);
}

function* register(eventId, userId) {
    let existingEvent = yield find(eventId);
    const registration = {
        eventId: eventId,
        userId: userId,
        is_active: true
    }
    return yield openHouseEventsRepository.createRegistration(registration);
}

function* unregister(registrationId) {
    const id = parseInt(registrationId);
    if (!isValidNumber(id)) {
        throw new OpenHouseEventValidationError('registration id is not valid');
    }

    let existingRegistration = yield openHouseEventsRepository.findRegistration(registrationId);
    if(existingRegistration == undefined){
        throw new OpenHouseEventValidationError('registration does not exist');
    }
    existingRegistration.is_active = false;
    return yield openHouseEventsRepository.updateRegistration(existingRegistration);
}

module.exports = {
    find,
    create,
    update,
    remove,
    register,
    unregister,
    OpenHouseEventValidationError
};
