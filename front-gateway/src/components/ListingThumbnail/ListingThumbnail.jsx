import React, { Component } from 'react';
import './ListingThumbnail.scss';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import ListingBadge from '../ListingBadge/ListingBadge';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import utils from '../../providers/utils';

class ListingThumbnail extends Component {
  getListingPath(listing) {
    return listing.slug || listing.id;
  }

  getListingDateStr(listing) {
    return new Date(listing.lease_start) <= Date.now() ?
      'מיידי' : utils.formatDate(listing.lease_start);
  }

  render() {
    const { listing } = this.props;
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : '';
    const building = listing.apartment.building;
    const areaDescriptionPrefix = building.neighborhood.neighborhood_name === 'אחר' ? '' : building.neighborhood.neighborhood_name + ', ';
    const areaDescription = areaDescriptionPrefix + building.city.city_name;

    return (
      <Col lg={4} sm={6} xs={12}>
        <NavLink to={'/apartments/' + this.getListingPath(listing)}
          className="thumbnail apt-thumb-container apt-thumb-container-single pull-right">
          <ListingBadge listing={listing} />
          <div className="apt-thumb-apt-image">
            <CloudinaryImage src={imageURL} height={500} />
          </div>
          <div className="apt-thumb-details">
            <div className="apt-thumb-details-title">
              {utils.getListingTitle(listing)}
            </div>
            <div className="apt-thumb-details-address">
              {areaDescription}
            </div>
            <div className="apt-thumb-details-extra">
              <span>
                {listing.apartment.size}</span><span className="apt-thumb-sub-text"> מ״ר</span>
              <span className="apt-thumb-details-extra-rooms">
                {listing.apartment.rooms}</span><span className="apt-thumb-sub-text"> חד'</span>
              <span className="apt-thumb-details-extra-date">
                <span className="apt-thumb-sub-text">תאריך כניסה </span>
                {this.getListingDateStr(listing)}
              </span>
            </div>
          </div>
          <div className="apt-thumb-caption">
            {listing.monthly_rent}<span className="apt-thumb-sub-text"> ₪</span>
          </div>
        </NavLink>
      </Col>
    );
  }
}

ListingThumbnail.propTypes = {
  listing: React.PropTypes.object.isRequired,
};

export default ListingThumbnail;
