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

function validateEventParamters(listing_id, start, end) {
    // TODO:  make sure listing exists (call apartements API).
    // For now just make sure listing id is provided
    if (!isValidNumber(listing_id)) {
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

function validateEventIsNotNotOverlappingExistingEvents(existingListingEvents, listing_id, start, end) {
    if(!existingListingEvents) return;
    console.log('------');
    existingListingEvents.forEach(function (existingEvent) {
        const range = moment.range(existingEvent.start_time, existingEvent.end_time);
        if (range.contains(start) || range.contains(end)) {
            throw new Error('new event is overlapping an existing event');
        }
    });
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
    const id = parseInt(openHouseEvent.id);
    if(!isValidNumber(id)){
        throw new Error('event id is not valid');
    }

    const existingEvent = yield openHouseEventsRepository.find(id);
    if(existingEvent == undefined){
        throw new Error('event does not exist');
    }

    const listing_id = parseInt(openHouseEvent.listing_id);
    const start = moment(openHouseEvent.start_time, moment.ISO_8601, true);
    const end = moment(openHouseEvent.end_time, moment.ISO_8601, true);

    validateEventParamters(listing_id, start, end);
    
    const existingListingEvents = yield openHouseEventsRepository.findByListingId(listing_id);
    const existingEventsWithoutCurrent = existingListingEvents.filter(function(existingEvent){
        return existingEvent.id != id;
    });

    validateEventIsNotNotOverlappingExistingEvents(existingEventsWithoutCurrent, listing_id, start, end);

    return yield openHouseEventsRepository.update({
        id: id,
        start_time: start,
        end_time: end,
        listing_id: listing_id,
        is_active: true
    });
}

function* remove(eventId){
    const id = parseInt(eventId);
    if(!isValidNumber(id)){
        throw new Error('event id is not valid');
    }

    const existingEvent = yield openHouseEventsRepository.find(id);
    if(existingEvent == undefined){
        throw new Error('event does not exist');
    }

    existingEvent.is_active = false;
    return yield openHouseEventsRepository.update(existingEvent);
}

module.exports = {
    create,
    update,
    remove
};
