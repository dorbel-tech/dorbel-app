'use strict';
class AuthProvider {
  constructor(clientId, domain, authStore) {
    const Auth0Lock = require('auth0-lock').default; // can only be required on client side
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: window.location.origin + '/login',
        responseType: 'token'
      },
      theme: {
        logo: 'http://res.cloudinary.com/dorbel/image/upload/c_scale,h_58,w_58/v1477485453/dorbel_logo_2_1_uvvf3j.png',
        primaryColor: '#31124b'
      },
      languageDictionary: {
        title: 'Welcome'
      }
    });
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    this.authStore = authStore;
  }

  _doAuthentication(authResult) {
    this.authStore.setToken(authResult.idToken);
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        window.console.log('Error loading the Profile', error);
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
