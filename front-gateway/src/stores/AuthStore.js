'use strict';
import jwtDecode from 'jwt-decode';

const noop = () => { };
// mocking localStorage on the server side - must be better way to do this ...
const localStorage = (global.window) ? global.window.localStorage : { getItem: noop, setItem: noop, removeItem: noop };

class AuthStore {
  get isLoggedIn() {
    const token = this.getToken();     
    return token && this.isTokenNotExpired(token);
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  isTokenNotExpired(token) {
    const valid = jwtDecode(token).exp > (Date.now() / 1000);
    if (!valid) { this.logout(); } 
    return valid;
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
