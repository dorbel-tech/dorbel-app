'use strict';
const db = require('./dbConnectionProvider');
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

const pollInterval = shared.config.get('NOTIFICATION_DB_POLL_INTERVAL_MS') || 1000*60;
let pollIntervalHandle;

function create(notification) {
  notification.status = 'pending';
  return db.models.notification.create(notification);
}

function cancel(cancelRequest) {
  if (!cancelRequest.relatedObjectId || cancelRequest.relatedObjectType) {
    throw new Error('cannot cancel events without related object id');
  }

  return db.models.notification.update({ status: 'canceled' }, {
    where: {
      notificationType: { $in: cancelRequest.notificationTypes },
      status: 'pending',
      relatedObjectId: cancelRequest.relatedObjectId,
      relatedObjectType: cancelRequest.relatedObjectType
    }
  });
}

function startPolling(handler) {
  pollIntervalHandle = setInterval(() => {
    logger.debug('polling for due notifications');
    db.models.notification.findAll({
      where : {
        status: 'pending',
        scheduledTo: { $lte: (new Date()).toISOString() }
      }
    })
    .then(pendingNotifications => {
      if (pendingNotifications.length) {
        logger.debug({ count: pendingNotifications.length }, 'found due notifications');
        pendingNotifications.forEach(notification => {
          notification.update({status: 'in-flight'})
          .then(() => handler(notification.dataValues))
          .then(() => notification.update({status: 'sent'}))
          .catch(err => {
            logger.error(err, 'failed to handle due notification');
            notification.update({status: 'pending'});
          }); // retry forever ?
        });
      }
    });
  }, pollInterval);
}

function stopPolling() {
  clearInterval(pollIntervalHandle);
}

module.exports = {
  create,
  startPolling,
  stopPolling,
  cancel
};
