'use strict';
class AuthProvider {
  constructor(clientId, domain, authStore) {
    const Auth0Lock = require('auth0-lock').default; // can only be required on client side
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: window.location.origin + '/login',
        responseType: 'token'
      }
    });
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    this.authStore = authStore;
  }

  _doAuthentication(authResult) {
    this.authStore.setToken(authResult.idToken);
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        this.authStore.setProfile(profile);
      }
    });
  }

  showLoginModal() {
    this.lock.show();
  }
}

module.exports = AuthProvider;
