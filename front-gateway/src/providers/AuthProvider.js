'use strict';
class AuthProvider {
  constructor(clientId, domain, authStore, router) {
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
    this.lock.on('authenticated', this.afterAuthentication.bind(this));
    this.authStore = authStore;
    this.router = router;
    this.showLoginModal = this.showLoginModal.bind(this); 
    this.logout = this.logout.bind(this);
  }

  afterAuthentication(authResult) {
    this.authStore.setToken(authResult.idToken);
    this.getProfile(authResult);
    if (authResult.state) {
      this.recoverStateAfterLogin(authResult.state);      
    }
  }

  recoverStateAfterLogin(stateString) {
    try {
      const stateBeforeLogin = JSON.parse(stateString);
      if (stateBeforeLogin && stateBeforeLogin.pathname) {
        this.router.setRoute(stateBeforeLogin.pathname);
      }
    } catch(ex) {
      window.console.error('error parsing state after login');
    }
  }

  getProfile(authResult) {
    // DEPRECATION NOTICE: This method will be soon deprecated, use `getUserInfo` instead
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        window.console.log('Error loading the Profile', error);
      } else {
        this.authStore.setProfile(profile);
      }
    });
  }

  showLoginModal() {
    this.lock.show({
      auth: {
        params: {
          state: JSON.stringify({
            pathname: window.location.pathname
          })
        }
      }
    });
  }

  logout() {
    this.authStore.logout();
    this.router.setRoute('/');
  }
}

module.exports = AuthProvider;
