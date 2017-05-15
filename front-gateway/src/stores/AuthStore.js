'use strict';
import { observable, computed } from 'mobx';
import { max } from 'lodash';
import jwtDecode from 'jwt-decode';
import localStorageHelper from './localStorageHelper';
import cookieStorageHelper from './cookieStorageHelper';
import EventEmitter from 'eventemitter3';

const ID_TOKEN_KEY = 'id_token';
const PROFILE_KEY = 'profile';

export default class AuthStore {
  @observable idToken = null;
  @observable profile = null;

  constructor(initialState = {}) {
    this.setToken(localStorageHelper.getItem(ID_TOKEN_KEY) || initialState.idToken);
    this.setProfile(localStorageHelper.getItem(PROFILE_KEY) || initialState.profile);
    this.events = new EventEmitter();
  }

  @computed get isLoggedIn() {
    return this.idToken && this.profile;
  }

  setToken(idToken) {
    this.idToken = idToken;

    if (process.env.IS_CLIENT) {
      if (this.logoutTimer) { clearTimeout(this.logoutTimer); }

      if (idToken) {
        const tokenExpiryTime = jwtDecode(idToken).exp;
        const tokenExpiryTimeInMs = tokenExpiryTime * 1000;
        const durationUntilExpiryInMs = tokenExpiryTimeInMs - Date.now();
        // token might already be expired and then the duration is negative
        const logoutTimerDelay = max([0, durationUntilExpiryInMs]);
        this.logoutTimer = setTimeout(() => { this.logout(); }, logoutTimerDelay);

        localStorageHelper.setItem(ID_TOKEN_KEY, idToken);
        // update expiry on cookieStorageHelper
        cookieStorageHelper.setItem(ID_TOKEN_KEY, idToken, new Date(tokenExpiryTimeInMs));
        // Used to indicate if its returning user or not for auth0 lock to show relevant signup or login tab.
        localStorageHelper.setItem('returning_user', true);
      } else {
        localStorageHelper.removeItem(ID_TOKEN_KEY);
        cookieStorageHelper.removeItem(ID_TOKEN_KEY);
      }
    }
  }

  setProfile(profile) {
    if (profile && profile.dorbel_user_id) {
      this.profile = profile;
      localStorageHelper.setItem(PROFILE_KEY, profile);
    } else {
      localStorageHelper.removeItem(PROFILE_KEY);
    }
  }

  updateProfile(profile) {
    Object.assign(this.profile, profile);
    this.setProfile(this.profile);
  }

  logout() {
    this.setToken(null);
    this.setProfile(null);
    this.events.emit('logout');

    if (process.env.IS_CLIENT) {
      location.reload(false);
    }
  }

  toJson() {
    return {
      idToken: this.idToken,
      profile: this.profile
    };
  }
}
