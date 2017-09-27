/**
 * AppProviders will consolidate all the providers in the application
 * Providers should supply data to the stores, but not store any data themselves
 */
'use strict';
import ApiProvider from './ApiProvider';
import ListingsProvider from './ListingsProvider';
import CityProvider from './CityProvider';
import NeighborhoodProvider from './NeighborhoodProvider';
import CloudinaryProvider from './CloudinaryProvider';
import MessagingProvider from './MessagingProvider';
import NotificationProvider from './NotificationProvider';
import ModalProvider from './ModalProvider';
import SearchProvider from './SearchProvider';
import LikeProvider from './LikeProvider';
import ListingImageProvider from './ListingImageProvider';
import NavProvider from './NavProvider';
import DocumentProvider from './DocumentProvider';
import ShortUrlProvider from './ShortUrlProvider';
import MatchingUsersProvider from './MatchingUsersProvider';

import utils from './utils';

function loadAuthProvider(appStore, router, apiProvider) {
  if (process.env.IS_CLIENT) {
    if (!window.dorbelConfig.AUTH0_FRONT_CLIENT_ID || !window.dorbelConfig.AUTH0_DOMAIN) {
      throw new Error('must set auth0 env vars');
    }
    const ClientAuthProvider = require('./auth/AuthProvider.client');
    return new ClientAuthProvider(window.dorbelConfig.AUTH0_FRONT_CLIENT_ID, window.dorbelConfig.AUTH0_DOMAIN, appStore.authStore, router, apiProvider);
  } else {
    const ServerAuthProvider = require('./auth/AuthProvider.server');
    return new ServerAuthProvider(appStore.authStore);
  }
}

class AppProviders {
  constructor(appStore, router) {
    this.cloudinaryProvider = new CloudinaryProvider();
    this.apiProvider = new ApiProvider(appStore);
    this.authProvider = loadAuthProvider(appStore, router, this.apiProvider);
    this.messagingProvider = new MessagingProvider(appStore.authStore, appStore.messagingStore);
    this.navProvider = new NavProvider(appStore, router);
    this.listingsProvider = new ListingsProvider(appStore, { api: this.apiProvider, navProvider: this.navProvider });
    this.listingImageProvider = new ListingImageProvider({ cloudinary: this.cloudinaryProvider });
    this.cityProvider = new CityProvider(appStore, this.apiProvider);
    this.neighborhoodProvider = new NeighborhoodProvider(appStore, this.apiProvider);
    this.notificationProvider = new NotificationProvider();
    this.modalProvider = new ModalProvider(appStore);
    this.searchProvider = new SearchProvider(appStore, { api: this.apiProvider });
    this.likeProvider = new LikeProvider(appStore, this.apiProvider);
    this.documentProvider = new DocumentProvider(appStore, this.apiProvider);
    this.shortUrlProvider = new ShortUrlProvider(appStore, this.apiProvider);
    this.matchingUsersProvider = new MatchingUsersProvider(appStore, this.apiProvider);
    this.utils = utils;
  }
}

module.exports = AppProviders;

