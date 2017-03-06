'use strict';
import promisify from 'es6-promisify';
import auth0 from './auth0helper';

class AuthProvider {
  constructor(clientId, domain, authStore, router) {
    this.lock = auth0.initLock(clientId, domain);
    this.lock.on('authenticated', this.afterAuthentication.bind(this));
    this.lock.on('hide', this.hideHandler.bind(this));
    this.authStore = authStore;
    this.router = router;
    this.showLoginModal = this.showLoginModal.bind(this);
    this.logout = this.logout.bind(this);
    this.reportIdentifyAnalytics(this.authStore.profile);
  }

  hideHandler() {
    if (this.backOnHide) {
      history.back();
    }
  }

  afterAuthentication(authResult) {
    this.authStore.setToken(authResult.idToken);
    this.getProfile(authResult)
    .then(() => { // wait until profile is set because our previous state might depend on it
      if (authResult.state) {
        this.recoverStateAfterLogin(authResult.state);
      }
    });
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
    return promisify(this.lock.getProfile, this.lock)(authResult.idToken)
    .then(profile => {
      let mappedProfile = auth0.mapAuth0Profile(profile);
      this.authStore.setProfile(mappedProfile);
      this.reportIdentifyAnalytics(mappedProfile);
      this.reportSignInAnalytics(mappedProfile);
    })
    .catch(error => {
      window.console.log('Error loading the Profile', error);
      throw error;
    });
  }

  showLoginModal(backOnHide) {
    this.backOnHide = backOnHide === true;
    this.lock.show({
      auth: {
        params: {
          // this state is used in recoverStateAfterLogin
          state: JSON.stringify({
            pathname: window.location.pathname
          }),
          scope: 'openid'
        }
      }
    });
  }

  logout() {
    this.authStore.logout();
  }

  reportIdentifyAnalytics(profile) {
    // https://segment.com/docs/integrations/intercom/#identify
    if (profile) { 
      window.analytics.identify(profile.dorbel_user_id, profile); 
    }
  }

  reportSignInAnalytics(profile) {
    // https://segment.com/docs/integrations/intercom/#track
    if (profile) { 
      window.analytics.track('user_login', { user_uuid: profile.dorbel_user_id });
    }
  }  
}

module.exports = AuthProvider;
