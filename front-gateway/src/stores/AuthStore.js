'use strict';
import { observable, computed } from 'mobx';
import { max } from 'lodash';
import jwtDecode from 'jwt-decode';
import localStorageHelper from './localStorageHelper';
import cookieStorageHelper from './cookieStorageHelper';
import NewListingStore from './NewListingStore';

const ID_TOKEN_KEY = 'id_token';
const PROFILE_KEY = 'profile';

export default class AuthStore {
  @observable idToken = null;
  @observable profile = null;

  constructor(initialState = {}) {
    this.setToken(localStorageHelper.getItem(ID_TOKEN_KEY) || initialState.idToken);
    this.setProfile(localStorageHelper.getItem(PROFILE_KEY) || initialState.profile);
    this.newListingStore = new NewListingStore(this);
  }

  @computed get isLoggedIn() {
    return this.idToken && this.profile;
  }

  setToken(idToken) {
    this.idToken = idToken;
    localStorageHelper.setItem(ID_TOKEN_KEY, idToken);

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    if (idToken) {
      const tokenExpiryTime = jwtDecode(idToken).exp;
      const tokenExpiryTimeInMs = tokenExpiryTime * 1000;
      const durationUntilExpiryInMs = tokenExpiryTimeInMs - Date.now();
      // token might already be expired and then the duration is negative
      const logoutTimerDelay = max([0, durationUntilExpiryInMs]);
      this.logoutTimer = setTimeout(() => { this.logout(); }, logoutTimerDelay);
      // update expiry on cookieStorageHelper
      cookieStorageHelper.setItem(ID_TOKEN_KEY, idToken, new Date(tokenExpiryTimeInMs));
    } else {
      cookieStorageHelper.removeItem(ID_TOKEN_KEY);
    }
  }

  setProfile(profile) {
    this.profile = profile;
    localStorageHelper.setItem(PROFILE_KEY, profile);
  }

  updateProfile(profile) {
    Object.assign(this.profile, profile);
    this.setProfile(this.profile);
  }

  logout() {
    this.setToken(null);
    this.setProfile(null);
    this.newListingStore.reset();
    location.reload(true);
  }

  toJson() {
    return {
      idToken: this.idToken,
      profile: this.profile
    };
  }
}
