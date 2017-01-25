'use strict';
import { observable } from 'mobx';
import jwtDecode from 'jwt-decode';

const noop = () => { };
// mocking localStorage on the server side - must be better way to do this ...
const localStorage = (global.window) ? global.window.localStorage : { getItem: noop, setItem: noop, removeItem: noop, clear: noop };

export default class AuthStore {
  @observable idToken;
  @observable profile;

  get isLoggedIn() {
    const token = this.getToken();
    return token && this.isTokenNotExpired(token);
  }

  setToken(idToken) {
    this.idToken = idToken;
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return this.idToken || localStorage.getItem('id_token');
  }

  isTokenNotExpired(token) {
    const valid = jwtDecode(token).exp > (Date.now() / 1000);
    if (!valid) { this.logout(); }
    return valid;
  }

  setProfile(profile) {
    this.profile = profile;
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  updateProfile(profile) {
    Object.assign(this.profile.user_metadata, profile);
    Object.assign(this.profile, profile);
    this.profile.name = profile.email || this.profile.email;
    
    this.setProfile(this.profile);
  }

  getProfile() {
    if (this.profile) {
      return this.profile;
    }

    const profile = localStorage.getItem('profile');
    this.profile = profile ? JSON.parse(profile) : undefined;
    return this.profile;
  }

  logout() {
    this.idToken = undefined;
    this.profile = undefined;

    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}

