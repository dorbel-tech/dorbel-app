import React, { Component } from 'react';
import './ListingThumbnail.scss';
import { Col } from 'react-bootstrap';
import NavLink from '~/components/NavLink';

class Listing extends Component {
  render() {
    const { listing } = this.props;
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
                        <h4>{listing.title}</h4>
                        <span>
                            {listing.apartment.building.street_name},{listing.apartment.building.city.city_name}
                        </span>
                    </div>
                </NavLink>
            </Col>
    );
  }
}

Listing.propTypes = {
  listing: React.PropTypes.object.isRequired,
};

export default Listing;



