'use strict';
/*
* This migration will
* a. Remove the oldest filter for users with more than 2 filters.
* b. Unsubscribe filters from email_notification if the user has any filter with email_notification:false
*/
module.exports = {
  up: function (queryInterface) {
    return Promise.all([
      queryInterface.sequelize.query(`
        DELETE target
        FROM filters AS target
        JOIN (
          SELECT MIN(id) AS minId
          FROM filters
          WHERE dorbel_user_id IN (
            SELECT dorbel_user_id FROM filters GROUP BY dorbel_user_id HAVING COUNT(*) > 2
          )
          GROUP BY dorbel_user_id
        ) AS idsToDelete ON target.id = idsToDelete.minId;
      `),
      queryInterface.sequelize.query(`
        UPDATE filters AS target
        JOIN (
          SELECT DISTINCT dorbel_user_id FROM filters
          WHERE email_notification = 0
        ) AS usersWhoUnsubscribed ON target.dorbel_user_id = usersWhoUnsubscribed.dorbel_user_id
        SET target.email_notification = 0;
      `)
    ]);
  },
  down: function () {
    // ⚠⚠⚠ This migration will delete stuff and change data. There is no going back ⚠⚠⚠
  }
};
