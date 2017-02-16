import React, { Component } from 'react';
import './ListingThumbnail.scss';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import ListingBadge from '../ListingBadge/ListingBadge';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import utils from '../../providers/utils';

class ListingThumbnail extends Component {
  getListingPath(listing) {
    return listing.slug ? escape(encodeURIComponent(unescape(listing.slug))) : listing.id;
  }

  render() {
    const { listing } = this.props;
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : '';

    return (
      <Col lg={4} sm={6} xs={12}>
        <NavLink to={'/apartments/' + this.getListingPath(listing)} className="thumbnail apt-thumb-container-single pull-right">
          <ListingBadge listing={listing} />
          <div className="apt-thumb-apt-image">
            <CloudinaryImage src={imageURL} height={500} />
          </div>
          <div className="apt-thumb-apt-bottom-strip">
            <ul>
              <li>{listing.monthly_rent} ₪</li>
              <span>|</span>
              <li>{listing.apartment.size} מ״ר</li>
              <span>|</span>
              <li>{listing.apartment.rooms} חדרים</li>
            </ul>
          </div>
          <div className="caption">
            <h4>{utils.getListingTitle(listing)}</h4>
            <span>
              {listing.apartment.building.street_name}, {listing.apartment.building.city.city_name}
            </span>
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



