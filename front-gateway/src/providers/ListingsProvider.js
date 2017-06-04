/**
 * ListingsProvider communicates with the Apartments API
 */
'use strict';
import _ from 'lodash';
import utils from './utils';
import { isObservableObject, toJS } from 'mobx';
import moment from 'moment';

class ListingsProvider {
  constructor(appStore, providers, router) {
    this.appStore = appStore;
    this.apiProvider = providers.api;
    this.oheProvider = providers.ohe;
    this.router = router;
  }

  loadFullListingDetails(idOrSlug) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/' + idOrSlug)
      .then(listing => {
        listing.title = utils.getListingTitle(listing);
        this.appStore.listingStore.set(listing);
        this.appStore.metaData = _.defaults(this.getListingMetadata(listing), this.appStore.metaData);
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
    let imageURL = sortedListingImages.length ? sortedListingImages[0].url : undefined;
    imageURL = utils.optimizeCloudinaryUrl(imageURL, IMAGE_WIDTH);

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
    let listingUrl = process.env.FRONT_GATEWAY_URL + '/apartments/';
    return listingUrl += listing.slug || listing.id;
  }

  uploadApartment(listing) {
    let createdListing;
    const { uploadMode } = this.appStore.newListingStore;
    return this.apiProvider.fetch('/api/apartments/v1/listings', { method: 'POST', data: listing })
      .then((newListing) => createdListing = newListing)
      .then(() => { // TODO: move OHE creation to pub/sub messages on background
        if (uploadMode == 'publish') {
          try {
            this.oheProvider.createOhe(Object.assign({ listing_id: createdListing.id }, listing.open_house_event));
          } catch (err) { /*eslint-disable eslint-enable*/ }
        }
      })
      .then(() => this.appStore.authStore.updateProfile({
        first_name: listing.user.firstname,
        last_name: listing.user.lastname,
        phone: listing.user.phone,
        email: listing.user.email
      }))
      .then(() => {
        const eventName = (uploadMode == 'publish') ? 'client_apartment_created' : 'client_apartment_created_for_management';
        window.analytics.track(eventName, { listing_id: createdListing.id }); // For Facebook conversion tracking.
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
          this.appStore.listingStore.listingTenantsById.set(listing_id, [addedTenant]);
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

  republish(property) {
    const { newListingStore } = this.appStore;
    const newListing = isObservableObject(property) ? toJS(property) : _.cloneDeep(property);
    newListing.lease_start = moment(property.lease_end).add(1, 'day').toISOString();
    newListing.lease_end = undefined;
    newListingStore.reset();
    newListingStore.loadListing(newListing);
    this.router.setRoute('/apartments/new_form/publish');
  }

  isRepublishable(listing) {
    return (listing.status === 'rented' || listing.status === 'unlisted') && this.isActiveListing(listing);
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
        sort: 'lease_start'
      })
    };

    return this.apiProvider.fetch('/api/apartments/v1/listings', { params })
      .then(listings => listingsByApartmentId.set(apartment_id, listings.reverse()));
  }

  validateApartment(listing) {
    return this.apiProvider.fetch('/api/apartments/v1/listings/validate', { method: 'POST', data: { apartment: listing.apartment } })
      .then((validationResp) => {
        console.log(validationResp);
      });
  }
}

module.exports = ListingsProvider;
