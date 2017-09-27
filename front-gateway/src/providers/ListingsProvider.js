/**
 * ListingsProvider communicates with the Apartments API
 */
'use strict';
import _ from 'lodash';
import utils from './utils';
import routesHelper from '~/routesHelper';

class ListingsProvider {
  constructor(appStore, providers) {
    this.appStore = appStore;
    this.apiProvider = providers.api;
    this.navProvider = providers.navProvider;
  }

  loadListingByApartmentId(id) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/by-apartment/' + id)
      .then(listing => {
        listing.title = utils.getListingTitle(listing);
        this.appStore.listingStore.set(listing);
        this.appStore.listingStore.setLastByApartmentId(listing);
        this.appStore.metaData = _.defaults(this.getListingMetadata(listing), this.appStore.metaData);
      })
      .catch((error) => {
        this.navProvider.showErrorPage(error.response.status);

        if (!process.env.IS_CLIENT) { // must throw on SSR order to return an error
          throw error;
        }
      });
  }

  loadFullListingDetails(idOrSlug) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + idOrSlug)
      .then(listing => {
        listing.title = utils.getListingTitle(listing);
        this.appStore.listingStore.set(listing);
        this.appStore.metaData = _.defaults(this.getListingMetadata(listing), this.appStore.metaData);
      })
      .catch((error) => {
        this.navProvider.showErrorPage(error.response.status);

        if (!process.env.IS_CLIENT) { // must throw on SSR order to return an error
          throw error;
        }
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
    const IMAGE_WIDTH = 1200;
    const IMAGE_HEIGHT = 630;
    const sortedListingImages = utils.sortListingImages(listing);
    let imageURL = sortedListingImages[0].url;
    imageURL = utils.optimizeCloudinaryUrl(imageURL, IMAGE_WIDTH, IMAGE_HEIGHT, true);

    return {
      description: listing.description,
      title: 'dorbel - ' + listing.title,
      image: {
        url: imageURL,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT
      },
      url: this.getCanonicalUrl(listing)
    };
  }

  getCanonicalUrl(listing) {
    return process.env.FRONT_GATEWAY_URL + routesHelper.getPropertyPath(listing);
  }

  uploadApartment(listing) {
    let createdListing;
    return this.apiProvider.fetch('/api/apartments/v1/listings', { method: 'POST', data: listing })
      .then((newListing) => createdListing = newListing)
      .then(() => this.appStore.authStore.updateProfile({
        first_name: listing.user.firstname,
        last_name: listing.user.lastname,
        phone: listing.user.phone,
        email: listing.user.email
      }))
      .then(() => {
        window.analytics.track('client_apartment_created', { listing_id: createdListing.id }); // For Facebook conversion tracking.
        return createdListing;
      });
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

  loadListingTenants(listing_id) {
    return this.apiProvider.fetch(`/api/apartments/v1/listings/${listing_id}/tenants`)
      .then(res => this.appStore.listingStore.listingTenantsById.set(listing_id, res))
      .catch(() => this.appStore.listingStore.listingTenantsById.set(listing_id, 'error'));
  }

  addTenant(listing_id, tenant) {
    return this.apiProvider.fetch(`/api/apartments/v1/listings/${listing_id}/tenants`, { method: 'POST', data: tenant })
      .then(addedTenant => {
        const listingTenants = this.appStore.listingStore.listingTenantsById.get(listing_id);
        if (listingTenants) {
          listingTenants.push(addedTenant);
        } else {
          this.appStore.listingStore.listingTenantsById.set(listing_id, [ addedTenant ]);
        }
      });
  }

  removeTenant(tenant) {
    return this.apiProvider.fetch(`/api/apartments/v1/listings/${tenant.listing_id}/tenants/${tenant.id}`, { method: 'DELETE' })
      .then(() => {
        const listingTenants = this.appStore.listingStore.listingTenantsById.get(tenant.listing_id);
        listingTenants.remove(tenant);
      });
  }

  isActiveListing(listing) {
    const { listingsByApartmentId } = this.appStore.listingStore;
    const listingHistory = listingsByApartmentId.get(listing.apartment_id);
    return listingHistory && listingHistory[0] && listingHistory[0].id === listing.id;
  }

  loadListingsForApartment(apartment_id) {
    const { listingsByApartmentId } = this.appStore.listingStore;

    const params = {
      q: JSON.stringify({
        apartment_id,
        myProperties: true,
        oldListings: true,
        order: 'lease_end'
      })
    };

    return this.apiProvider.fetch('/api/apartments/v1/listings', { params })
      .then(listings => listingsByApartmentId.set(apartment_id, listings.reverse()));
  }

  validateApartment(listing) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/validation', { method: 'POST', data: { apartment: listing.apartment } });
  }
}

module.exports = ListingsProvider;
