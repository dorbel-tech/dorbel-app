/**
 * ListingsProvider communicates with the Apartments API
 */
'use strict';
import _ from 'lodash';
import utils from './utils';

class ListingsProvider {
  constructor(appStore, providers) {
    this.appStore = appStore;
    this.apiProvider = providers.api;
    this.oheProvider = providers.ohe;
  }

  loadFullListingDetails(idOrSlug) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + idOrSlug)
      .then(listing => {
        listing.title = utils.getListingTitle(listing);
        this.appStore.listingStore.set(listing);
        this.appStore.metaData = _.defaults(this.getListingMetadata(listing), this.appStore.metaData);
        return Promise.all([
          this.oheProvider.loadListingEvents(listing.id),
          this.oheProvider.getFollowsForListing(listing.id)
        ]);
      });
  }

  loadListingPageViews(listingId) {
    return this.apiProvider.fetch('/api/apartments/v1/page_views/listings/' + listingId)
    .then(response => {
      if (response[listingId]) {
        this.appStore.listingStore.listingViewsById.set(listingId, response[listingId].views);
      }
    });
  }

  getListingMetadata(listing) {
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : undefined;

    return {
      description: listing.description,
      title: 'dorbel - ' + listing.title,
      image: {
        url: imageURL,
        width: 1200,
        height: 630
      },
      url: this.getCanonicalUrl(listing)
    };
  }

  getCanonicalUrl(listing) {
    let listingUrl = process.env.FRONT_GATEWAY_URL + '/apartments/';
    return listingUrl += listing.slug || listing.id;
  }

  uploadApartment(listing) {
    let createdListing;
    return this.apiProvider.fetch('/api/apartments/v1/listings', { method: 'POST', data: listing })
      .then((newListing) => createdListing = newListing)
      .then(() => { // TODO: move OHE creation to pub/sub messages on background
        try {
          this.oheProvider.createOhe(Object.assign({ listing_id: createdListing.id }, listing.open_house_event));
        } catch (err) { /*eslint-disable eslint-enable*/ }
      })
      .then(() => this.appStore.authStore.updateProfile({
        first_name: listing.user.firstname,
        last_name: listing.user.lastname,
        phone: listing.user.phone,
        email: listing.user.email
      }))
      .then(() => { return createdListing; });
  }

  updateListing(listingId, data) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId, { method: 'PATCH', data })
    .then((res) => {
      this.appStore.listingStore.set(res);
      return res;
    });
  }

  updateListingStatus(listingId, status) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + listingId, { method: 'PATCH', data: { status } })
    .then((res) => {
      let listing = this.appStore.listingStore.listingsById.get(listingId);
      listing.status = status;
      _.set(listing, 'meta.possibleStatuses', _.get(res, 'meta.possibleStatuses'));
    });
  }

}

module.exports = ListingsProvider;
