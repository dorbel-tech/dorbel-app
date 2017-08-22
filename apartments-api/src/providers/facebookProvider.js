'use strict';
const superagent = require('superagent');
const _ = require('lodash');

function getMutualFriends(access_token, user_id) {
  return new Promise((resolve, reject) =>
    superagent
    .get(`https://graph.facebook.com/v2.10/${user_id}`)
    .query({
      access_token,
      fields: 'context.fields(all_mutual_friends.limit(5))'
    })
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) { return reject(err); }

      const rawFriends = _.get(res, 'body.context.all_mutual_friends.data') || [];
      const friends = rawFriends.map(friend => ({
        name: friend.name,
        imageUrl: _.get(friend, 'picture.data.url')
      }));

      resolve(friends);
    })
  );
}

module.exports = {
  getMutualFriends
};
