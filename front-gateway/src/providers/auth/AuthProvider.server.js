'use strict';
import shared from 'dorbel-shared';
import auth0 from './auth0helper';

class ServerAuthProvider {

  constructor(authStore) {
    this.authStore = authStore;
  }

  * loginWithCookie(cookieProvider) {
    // not so happy with this flow - the store should be the one to access the cookie :|
    const idToken = cookieProvider.get('id_token');

    if (idToken) {
      this.authStore.setToken(idToken);

      const profile = yield shared.utils.userManagement.getProfileFromIdToken(idToken);
      if (profile) {
        let mappedProfile = auth0.mapAuth0Profile(profile);
        this.authStore.setProfile(mappedProfile);
      }
    }
  }

}

module.exports = ServerAuthProvider;
