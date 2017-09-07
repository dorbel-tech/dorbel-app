import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import ListingBadge from '../ListingBadge/ListingBadge';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import LikeButton from '../LikeButton/LikeButton';
import utils from '../../providers/utils';
import { getPropertyPath, getDashMyPropsPath } from '~/routesHelper';

import './ListingThumbnail.scss';

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
      return getPropertyPath(listing);
    }
  }

  getListingDateStr(isRented) {
    const { listing } = this.props;
    const listingLeaseDate = isRented ? listing.lease_end : listing.lease_start;
    return new Date(listingLeaseDate) <= Date.now() ? 'מיידי' : utils.formatDate(listingLeaseDate);
  }

  render() {
    const { listing, thumbIndex } = this.props;
    let mdColSize = 4;
    if (thumbIndex !== undefined) {
      // TODO: Check if charAt(0) is better performance wise
      const indexMod = thumbIndex % 10;
      if (indexMod === 0 || indexMod === 6) {
        mdColSize *= 2;
      }
    }
    const isRented = listing.status === 'rented';
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages[0].url;

    const listingDateTitle = isRented ? 'כניסה משוערת ' : 'תאריך כניסה ';
    const classLeaseDate = new Date(listing.lease_start) <= Date.now() ? 'apt-thumb-lease-immediate' : 'apt-thumb-lease-date';
    const listingDateStr = this.getListingDateStr(isRented);
    const listingMrTitle = isRented ? 'מחיר נוכחי ' : '';

    return (
      <Col md={mdColSize} sm={6} xs={12}>
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
                <LikeButton apartmentId={listing.apartment_id} listingId={listing.id} showText/>
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
  isMyProperties: React.PropTypes.bool,
  thumbIndex: React.PropTypes.number
};

export default ListingThumbnail;
