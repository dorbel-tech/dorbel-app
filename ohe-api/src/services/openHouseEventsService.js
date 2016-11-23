'use strict';
const openHouseEventsRepository = require('../openHouseEventsDb/repositories/openHouseEventsRepository');
const moment = require('moment');
const momentRange = require('moment-range');

function isValidNumber(value){
    return Number.isInteger(value);
}

function isValidDate(date){
    return date.isValid();
}

function validateEventParamters(listingId, start, end) {
    // TODO:  make sure listing exists (call apartements API).
    // For now just make sure listing id is provided
    if (!isValidNumber(listingId)) {
        throw new Error('listing id is not valid');
    }
    if (!isValidDate(start)) {
        throw new Error('start time is not valid');
    }
    if (!isValidDate(end)) {
        throw new Error('end time is not valid');
    }

    if (end.diff(start, 'minutes') < 30) {
        throw new Error('open house event should be at least 30 minutes');
    }
}

function validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listingId, start, end) {
    existingListingEvents.forEach(function (existingEvent) {
        const range = moment.range(existingEvent.startTime, existingEvent.endTime);
        if (range.contains(start) || range.contains(end)) {
            throw new Error('new event is overlapping an existing event');
        }
    });
}

function* create(openHouseEvent) {
    
    const listingId = parseInt(openHouseEvent.listingId);
    const start = moment(openHouseEvent.startTime, moment.ISO_8601, true);
    const end = moment(openHouseEvent.endTime, moment.ISO_8601, true);

    validateEventParamters(listingId, start, end);

    const existingListingEvents = yield openHouseEventsRepository.eventsForListing(listingId);
    validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listingId, start, end);

    return yield openHouseEventsRepository.create({
        startTime: start,
        endTime: end,
        listingId: listingId,
        isActive: true
    });
}

function* update(openHouseEvent) {
    const id = parseInt(openHouseEvent.id);
    if(!isValidNumber(id)){
        throw new Error('event id is not valid');
    }

    const existingEvent = yield openHouseEventsRepository.get(id);
    if(existingEvent == undefined){
        throw new Error('event does not exist');
    }

    const listingId = parseInt(openHouseEvent.listingId);
    const start = moment(openHouseEvent.startTime, moment.ISO_8601, true);
    const end = moment(openHouseEvent.endTime, moment.ISO_8601, true);

    validateEventParamters(listingId, start, end);
    
    const existingListingEvents = yield openHouseEventsRepository.eventsForListing(listingId);
    const existingEventsWithoutCurrent = existingListingEvents.filter(function(existingEvent){
        return existingEvent.id != id;
    });

    validateEventIsNotNotOverlappingExistingEvents(existingEventsWithoutCurrent, listingId, start, end);

    return yield openHouseEventsRepository.update({
        id: id,
        startTime: start,
        endTime: end,
        listingId: listingId,
        isActive: true
    });
}

function* remove(eventId){
    const id = parseInt(eventId);
    if(!isValidNumber(id)){
        throw new Error('event id is not valid');
    }

    const existingEvent = yield openHouseEventsRepository.get(id);
    if(existingEvent == undefined){
        throw new Error('event does not exist');
    }

    return yield openHouseEventsRepository.delete(id);
}

module.exports = {
    create,
    update,
    remove
};
