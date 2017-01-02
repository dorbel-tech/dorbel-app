import React, { Component } from 'react';
import './Listing.scss';

class Listing extends Component {

  render() {
    return (
            <div className="col-lg-4 col-md-4 col-sm-6">
                <a href="#" className="thumbnail apt-thumb-container-single pull-right">
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
                        <span>{this.props.data.apartment.building.street_name}, תל אביב</span>
                    </div>
                </a>
            </div>
    );
  }
}

Listing.propTypes = {
  data: React.PropTypes.object.isRequired,
};


export default Listing;



