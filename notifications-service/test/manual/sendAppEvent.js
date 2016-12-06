require('dotenv').config({path: __dirname + '/../../../.env'});
const shared = require('dorbel-shared');
const config = shared.config;
const messageBus = shared.utils.messageBus;

messageBus.publish(config.get('NOTIFICATIONS_SNS_TOPIC_ARN'), messageBus.eventType.APARTMENT_CREATED, { 
  user_uuid: '6b67e2b2-1857-47dd-a567-e4bd2455e231',
  apartment_id: 777    
});
