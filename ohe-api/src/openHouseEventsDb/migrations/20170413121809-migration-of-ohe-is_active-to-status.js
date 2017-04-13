'use strict';
const logger = require('dorbel-shared').logger.getLogger(module);

module.exports = {
  up: function (queryInterface) {
    queryInterface.sequelize.query(
      'UPDATE open_house_events.open_house_events set status = "deleted" WHERE is_active = 0'
    )
    .then((updateRes) => { logger.info({ res: updateRes }, 'Succesfully migrated OHEs with new status'); })
    .catch((err) => { logger.error({ error: err }, 'Faild to update listing during comments/directions migration'); });
  }
};
