'use strict';
const google = require('googleapis');
const shared = require('dorbel-shared');
const moment = require('moment');

const logger = shared.logger.getLogger(module);
const config = shared.config;

let ga;

const gaAuthScope = ['https://www.googleapis.com/auth/analytics.readonly'];

function init() {
  const googleAnalyticsID = config.get('GOOGLE_ANALYTICS_ID');
  const serviceEmail = config.get('GOOGLE_API_SERVICE_EMAIL');
  const serviceKey = config.get('GOOGLE_API_SERVICE_KEY');

  if (!googleAnalyticsID || !serviceEmail || !serviceKey) {
    logger.warn('Missing Environment keys for Google Analytics provider');
    return Promise.reject();
  }

  const jwtClient = new google.auth.JWT(serviceEmail, null, JSON.parse('"' + serviceKey + '"'), gaAuthScope, null);

  ga = google.analytics({
    version: 'v3',
    auth: jwtClient
  });

  return new Promise((resolve, reject) => {
    jwtClient.authorize(function (err) {
      if (err) {
        logger.error('error on google auth', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getPageViews(urls) {
  if (!ga) {
    return Promise.reject();
  } else if (!urls || urls.length === 0) {
    return Promise.resolve([]);
  }

  var opts = {
    ids: config.get('GOOGLE_ANALYTICS_ID'),
    metrics: 'ga:pageviews',
    dimensions: 'ga:pagePath',
    'start-date': '2017-01-01',
    'end-date': moment().format('YYYY-MM-DD')
  };

  // https://developers.google.com/analytics/devguides/reporting/core/v3/reference#filters
  opts.filters = urls.map(url => `ga:pagePath==${url}`).join(',');

  return new Promise((resolve, reject) => {
    ga.data.ga.get(opts, (err, resp) => {
      if (err) {
        return reject(err);
      }

      var results = resp.rows.map(row => ({ url: row[0], views: parseInt(row[1]) }));
      resolve(results);
    });
  });
}

module.exports = {
  init,
  getPageViews
};
