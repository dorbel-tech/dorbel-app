'use strict';
import promisify from 'es6-promisify';
import auth0 from './auth0helper';
import autobind from 'react-autobind';

class AuthProvider {
  constructor(clientId, domain, authStore, router, apiProvider) {
    autobind(this);

    this.lock = auth0.initLock(clientId, domain);
    this.lock.on('authenticated', this.afterAuthentication);
    this.lock.on('hide', this.hideHandler);
    this.authStore = authStore;
    this.router = router;
    this.apiProvider = apiProvider;
    this.reportIdentifyAnalytics(this.authStore.profile);
    this.reLoadFullProfileCounter = 0;
  }

  hideHandler() {
    if (this.backOnHide) {
      history.back();
    }
  }

  afterAuthentication(authResult) {
    this.authStore.setToken(authResult.idToken);
    this.getUserInfo(authResult)
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
    } catch (ex) {
      window.console.error('error parsing state after login');
    }
  }

  getUserInfo(authResult) {
    return promisify(this.lock.getUserInfo, this.lock)(authResult.accessToken)
      .then(profile => this.reLoadFullProfile(authResult, profile))
      .catch(error => {
        window.console.log('Error loading the Profile', error);
        throw error;
      });
  }

  // Retry loading full user profile until we get dorbel_user_id which is updated async using auth0 rules.
  // Especially relevant for just signed up users.
  reLoadFullProfile(authResult, profile) {
    if (profile.app_metadata.dorbel_user_id) {
      this.setProfile(profile);
      this.reportSignup(profile);
    } else if (this.reLoadFullProfileCounter < 5) {
      window.setTimeout(() => { this.getUserInfo(authResult); }, 1000); // Try to get it again after 1 second.
      this.getUserProfileRetryCounter++;
    }
  }

  reportSignup(profile) {
    if (profile && profile.app_metadata.first_login) {
      window.analytics.track('client_user_signup', { user_id: profile.app_metadata.dorbel_user_id }); // For Facebook conversion tracking.
      profile.app_metadata.first_login = false;
      this.setProfile(profile);
    }
  }

  setProfile(profile) {
    let mappedProfile = auth0.mapAuth0Profile(profile);
    this.authStore.setProfile(mappedProfile);
    this.reportIdentifyAnalytics(mappedProfile);
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

  updateUserProfile(userProfile) {
    return this.apiProvider.fetch('/api/apartments/v1/user-profile/', { method: 'PATCH', data: userProfile })
      .then(this.setProfile);
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
}

module.exports = AuthProvider;
