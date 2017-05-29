import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import ListingBadge from '../ListingBadge/ListingBadge';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import LikeButton from '../LikeButton/LikeButton';
import utils from '../../providers/utils';
import { getListingPath, getDashMyPropsPath } from '~/routesHelper';

import './ListingThumbnail.scss';

const openOrRegistered = ohe => (['open', 'registered'].indexOf(ohe.status) > -1);

@inject('appStore', 'appProviders') @observer
class ListingThumbnail extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  getListingUrl(listing) {
    if (this.props.isMyProperties) {
      return getDashMyPropsPath(listing);
    } else {
      return getListingPath(listing);
    }
  }

  handleFollow(e) {
    // We need both to prevent the navigation
    e.stopPropagation();
    e.preventDefault();

    const { appProviders, listing } = this.props;

    if (appProviders.authProvider.shouldLogin()) {
      return;
    }

    appProviders.oheProvider.getFollowsForListing(listing.id).then(() => {
      appProviders.oheProvider.toggleFollow(listing);
    });
  }

  getOheLabel() {
    const { listing, appStore }  = this.props;

    if (appStore.oheStore.isListingLoaded(listing.id)) {
      if (listing.status === 'rented') {
        const userIsFollowing = appStore.oheStore.usersFollowsByListingId.get(listing.id);
        const callToActionText = userIsFollowing ? 'הפסק עדכונים' : 'עדכנו אותי';
        return <span className="pull-left">
                <span className="apt-thumb-follow" onClick={this.handleFollow}>{callToActionText}</span>
              </span>;
      } else {
        const oheCount = appStore.oheStore.oheByListingId(listing.id).filter(openOrRegistered).length;
        if (oheCount) {
          return <span className="pull-left apt-thumb-ohe-text">{oheCount} מועדי ביקור זמינים</span>;
        } else {
          return (
            <span className="pull-left">
              <span className="apt-thumb-no-ohe">אין מועדי ביקור</span>
              &nbsp;
              <span className="apt-thumb-ohe-text">עדכנו אותי</span>
            </span>
          );
        }
      }
    } else {
      return null;
    }
  }

  render() {
    const { listing } = this.props;
    const isRented = listing.status === 'rented';
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : '';

    const listingDateTitle = isRented ? 'כניסה משוערת ' : 'תאריך כניסה ';
    const classLeaseDate = new Date(listing.lease_start) <= Date.now() ? 'apt-thumb-lease-immediate' : 'apt-thumb-lease-date';
    const listingDateStr = new Date(listing.lease_start) <= Date.now() ? 'מיידי' : utils.formatDate(listing.lease_start);
    const listingMrTitle = isRented ? 'מחיר נוכחי ' : '';

    return (
      <Col lg={4} sm={6} xs={12}>
        <NavLink to={this.getListingUrl(listing)}
          className="thumbnail apt-thumb-container apt-thumb-container-single pull-right">
          <ListingBadge listing={listing} />
          <div className="apt-thumb-apt-image">
            <CloudinaryImage src={imageURL} height={500} />
          </div>
          <div className="apt-thumb-details">
            <div className="apt-thumb-details-header">
              <div className="apt-thumb-details-title">
                {utils.getListingTitle(listing)}
              </div>
              <div className="apt-thumb-details-like">
                <LikeButton listingId={listing.id} />
              </div>
            </div>
            <div className="apt-thumb-details-address">
              {utils.getListingSubTitle(listing)}
            </div>
            <div className="apt-thumb-details-extra">
              <span>
                {listing.apartment.size}</span><span className="apt-thumb-sub-text"> מ״ר</span>
              <span className="apt-thumb-details-extra-rooms">
                {listing.apartment.rooms}</span><span className="apt-thumb-sub-text"> חד'</span>
              <span className="apt-thumb-details-extra-date">
                <span className={'apt-thumb-sub-text ' + (isRented ? 'apt-thumb-warning-sub-text' : '')}>{listingDateTitle}</span>
                <span className={classLeaseDate}>{listingDateStr}</span>
              </span>
            </div>
          </div>
          <div className="apt-thumb-caption">
            <span className="apt-thumb-sub-text apt-thumb-warning-sub-text">{listingMrTitle}</span>
            {listing.monthly_rent}
            <span className="apt-thumb-sub-text"> ₪</span>
            { this.getOheLabel() }
          </div>
        </NavLink>
      </Col>
    );
  }
}

ListingThumbnail.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object.isRequired,
  isMyProperties: React.PropTypes.bool
};

export default ListingThumbnail;
