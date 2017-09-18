'use strict';
import AuthProvider from './AuthProvider.client.js';

jest.mock('./auth0helper');

describe('Auth Provider - Client', () => {
  let auth0helper;

  beforeAll(() => {
    auth0helper = require('./auth0helper'); // this is the auto-mocked version - has all the functions but they all returned undefined
  });

  describe('constructor', () => {

    it('should init lock and register lock events', () => {
      const clientId = 'Hi I am the client';
      const domain = 'Hello sir!';
      const lockMock = { on: jest.fn() };
      auth0helper.initLock = jest.fn(() => lockMock);
      const provider = new AuthProvider(clientId, domain, {}, {}, {});

      expect(auth0helper.initLock).toHaveBeenCalledWith(clientId, domain);
      expect(lockMock.on).toHaveBeenCalledTimes(2);
      expect(lockMock.on).toHaveBeenCalledWith('authenticated', provider.afterAuthentication);
      expect(lockMock.on).toHaveBeenCalledWith('hide', provider.hideHandler);
    });

    it('should init the auth0sdk', () => {
      const clientId = 'Oh its the client again';
      const domain = 'You again';
      new AuthProvider(clientId, domain, {}, {}, {});

      expect(auth0helper.initAuth0Sdk).toHaveBeenCalledWith(clientId, domain);
    });

    it('should report user identity to segment', () => {
      const dorbel_user_id = 'gazorpazorp';
      const authStore = { profile: { dorbel_user_id } };
      window.analytics = { identify: jest.fn() };
      new AuthProvider(1, 2, authStore, {}, {});

      expect(window.analytics.identify).toHaveBeenCalledWith(dorbel_user_id);
    });
  });

  describe('afterAuthentication', () => {
    // this function is usually run by the Auth0 lock when login-redirect hits /Login

    it('should call link account if that is the action', () => {
      const authStore = { profile: { auth0_user_id: 'user1' }, idToken: 'token1' };
      const provider = new AuthProvider(1, 'domain', authStore, {}, {});

      const authResult = { state: JSON.stringify({ actionBeforeLogin: 'link-accounts' }), idToken: 'token2' };
      auth0helper.linkAccount = jest.fn(() => Promise.resolve());

      return provider.afterAuthentication(authResult)
      .then(() => {
        expect(auth0helper.linkAccount).toHaveBeenCalledWith('domain', 'user1', 'token1', 'token2')
      });
    });

    it('should close window after successful account linking', () => {
      const provider = new AuthProvider(1, 2, { profile: '' }, {}, {});
      const authResult = { state: JSON.stringify({ actionBeforeLogin: 'link-accounts' }) };
      auth0helper.linkAccount = jest.fn(() => Promise.resolve());
      window.close = jest.fn();

      return provider.afterAuthentication(authResult)
      .then(() => expect(window.close).toHaveBeenCalled());
    });
  });

  describe('link accounts', () => {
    // this fails because there is a bug with JSDom / Jest, regarding window.location
    it.skip('should call auth0sdk to authorize social connection', () => {
      const connection = 'nip-alert';
      const sdkMock = { popup: { authorize: jest.fn } };
      auth0helper.initAuth0Sdk = () => sdkMock;
      window.location = { origin : 'httz://wuw.dorknob.io' };
      const provider = new AuthProvider(1, 2, {}, {}, {});

      return provider.linkSocialAccount(connection)
      .then(() => {
        expect(sdkMock.popup.authorize).toHaveBeenCalledWith({
          connection, responseType: 'token id_token',
          redirect_uri: 'httz://wuw.dorknob.io/login',
          state: JSON.stringify({ actionBeforeLogin: 'link-accounts' })
        });
      });
    });
  });
});
