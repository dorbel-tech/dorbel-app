'use strict';
const AuthenticationClient = require('auth0').AuthenticationClient;
const promisify = require('es6-promisify');

const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID
});

const getInfo = promisify(auth0.tokens.getInfo, auth0.tokens);

function* parseAuthToken(next) {
  const token = getAccessTokenFromHeader(this.request);

  if (token) {
    // TODO this takes forever and MUST be cached
    let info = yield getInfo(token);
    this.request.headers['x-user-profile'] = JSON.stringify({
      id: info.dorbel_user_id,
      email: info.email,
      name: info.name,
      email_verified: info.email_verified
    });
  }

  yield next;
}

function getAccessTokenFromHeader(req) {
  if (req.headers.authorization) {
    var tokenMatch = req.headers.authorization.match(/^bearer (.+)/i);
    if (tokenMatch) return tokenMatch[1];
  }
}

module.exports = {
  parseAuthToken
};

