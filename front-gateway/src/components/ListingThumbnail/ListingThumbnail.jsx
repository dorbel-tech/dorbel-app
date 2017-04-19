import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './ListingThumbnail.scss';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import ListingBadge from '../ListingBadge/ListingBadge';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import LikeButton from '../LikeButton/LikeButton';
import utils from '../../providers/utils';

@inject('appStore') @observer
class ListingThumbnail extends Component {
  getListingUrl(listing) {
    if (this.props.isMyProperties) {
      return utils.getDashPropertyPath(listing);
    } else {
      return utils.getListingPath(listing);
    }    
  }

  getOheLabel() {
    const { listing, appStore }  = this.props;

    if (appStore.oheStore.isListingLoaded(listing.id)) {
      const oheCount = appStore.oheStore.oheByListingId(listing.id).filter(ohe => ohe.status === 'open').length;
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
    } else {
      return null;
    }
  }

  render() {
    const { listing } = this.props;
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : '';
    const classLeaseDate = new Date(listing.lease_start) <= Date.now() ? 'apt-thumb-lease-immediate' : 'apt-thumb-lease-date';
    const listingDateStr = new Date(listing.lease_start) <= Date.now() ? 'מיידי' : utils.formatDate(listing.lease_start);

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
                <span className="apt-thumb-sub-text">תאריך כניסה </span>
                <span className={classLeaseDate}>{listingDateStr}</span>
              </span>
            </div>
          </div>
          <div className="apt-thumb-caption">
            {listing.monthly_rent}<span className="apt-thumb-sub-text"> ₪</span>
            { this.getOheLabel() }
          </div>
        </NavLink>
      </Col>
    );
  }
}

ListingThumbnail.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired,
  isMyProperties: React.PropTypes.string
};

export default ListingThumbnail;
