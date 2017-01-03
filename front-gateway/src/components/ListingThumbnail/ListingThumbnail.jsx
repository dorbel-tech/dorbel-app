import React, { Component } from 'react';
import './ListingThumbnail.scss';
import { Col } from 'react-bootstrap';

class Listing extends Component {
  render() {
    return (
            <Col lg={4} md={4} sm={6}>
                <a href={'/apartments/' + this.props.data.id} className="thumbnail apt-thumb-container-single pull-right">
                    <div className="apt-thumb-apt-image">
                        <img src={this.props.data.images[0] ?
                            this.props.data.images[0].url : ''} alt="..." />
                    </div>
                    <div className="apt-thumb-apt-bottom-strip">
                        <ul>
                            <li>{this.props.data.monthly_rent} ₪</li>
                            <span>|</span>
                            <li>{this.props.data.apartment.size} מ״ר</li>
                            <span>|</span>
                            <li>{this.props.data.apartment.rooms} חדרים</li>
                        </ul>

                    </div>
                    <div className="caption">
                        <h4>{this.props.data.title}</h4>
                        <span>
                            {this.props.data.apartment.building.street_name},{this.props.data.apartment.building.city.city_name}
                        </span>
                    </div>
                </a>
            </Col>
    );
  }
}

Listing.propTypes = {
    data: React.PropTypes.object.isRequired,
};


export default Listing;



