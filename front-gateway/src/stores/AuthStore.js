'use strict';
const noop = () => { };
// mocking localStorage on the server side - must be better way to do this ...
const localStorage = (global.window) ? global.window.localStorage : { getItem: noop, setItem: noop, removeItem: noop };

class AuthStore {
  get isLoggedIn() {
    // TODO : check token is still valid !
    return !!this.getToken();
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  setProfile(profile) {
    // TODO : this has to go some @obserevable so it can be properly used in the app
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  getProfile() {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}

module.exports = AuthStore;
