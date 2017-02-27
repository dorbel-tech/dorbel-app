const google = require('googleapis');

const key = require('/home/avner/Downloads/dorbel-a7733f097cf8.json');

var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/analytics'],
  null
);

var ga = google.analytics('v3');

var opts = {
  ids: 'ga:138157029',
  metrics: 'ga:pageviews',
  'start-date':'2017-02-01',
  'end-date':'2017-03-01',
  filters: 'ga:pagePath==/apartments/1', // https://developers.google.com/analytics/devguides/reporting/core/v3/reference#filters
  auth: jwtClient
};

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log('error on auth', err);
    return;
  }

  ga.data.ga.get(opts,
  function (err, resp) {
    if (err) {
      console.log('error on data get', err);
      return;
    }

    console.log(resp.rows[0][0], 'pageviews');
  });
});


