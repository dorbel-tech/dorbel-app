import React, { Component } from 'react';
import './ListingThumbnail.scss';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';

class ListingThumbnail extends Component {
  render() {
    const { listing } = this.props;
    const title = listing.title || `דירת ${listing.apartment.rooms} חד׳ ברח׳ ${listing.apartment.building.street_name}`;

    return (
        <Col lg={4} md={4} sm={6}>
            <NavLink to={'/apartments/' + listing.id} className="thumbnail apt-thumb-container-single pull-right">
                <div className="apt-thumb-apt-image">
                    <img src={listing.images[0] ?
                        listing.images[0].url : ''} alt="..." />
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
                        <h4>{title}</h4>
                        <span>
                            {listing.apartment.building.street_name},{listing.apartment.building.city.city_name}
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



