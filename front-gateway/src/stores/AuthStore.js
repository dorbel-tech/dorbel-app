'use strict';
import { observable, computed } from 'mobx';
import { max } from 'lodash';
import jwtDecode from 'jwt-decode';
import localStorageHelper from './localStorageHelper';

const ID_TOKEN_KEY = 'id_token';
const PROFILE_KEY = 'profile';

export default class AuthStore {
  @observable idToken = null;
  @observable profile = null;

  constructor() {
    this.setToken(localStorageHelper.getItem(ID_TOKEN_KEY));
    this.setProfile(localStorageHelper.getItem(PROFILE_KEY));
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
    }
  }

  setProfile(profile) {
    this.profile = profile;
    localStorageHelper.setItem(PROFILE_KEY, profile);
  }

  updateProfile(profile) {
    Object.assign(this.profile.user_metadata, profile.user_metadata);
    Object.assign(this.profile, profile);

    this.setProfile(this.profile);
  }

  logout() {
    this.setToken(null);
    this.setProfile(null);
  }
}

