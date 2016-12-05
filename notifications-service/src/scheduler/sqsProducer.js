/**
 * This file is for sending messages to SQS queues
 */
'use strict';
const Producer = require('sqs-producer');
const promisify = require('es6-promisify');
const shared = require('dorbel-shared');
const config = shared.config;

const queues = {
  email: Producer.create({
    queueUrl: config.get('NOTIFICATIONS_EMAIL_SQS_QUEUE_URL'),
    region: 'eu-west-1'
  }),
  sms: Producer.create({
    queueUrl: config.get('NOTIFICATIONS_SMS_SQS_QUEUE_URL'),
    region: 'eu-west-1'
  }) 
};

function send(medium, messages) {
  let queue = queues[medium];

  if (!queue) {
    throw new Error('attempted to send SQS message with unknown medium : ', medium);
  }

  return promisify(queue.send, queue)(messages);
}

module.exports = {
  send
};
