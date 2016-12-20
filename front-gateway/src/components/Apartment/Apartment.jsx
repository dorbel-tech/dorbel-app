import React, { Component } from 'react';
import { observer } from 'mobx-react';
import svgIcons from '~/assets/images/images.sprite.svg';
import ApartmentAmenities from './ApartmentAmenities.jsx';
import OHEList from './OHEList.jsx';
import './Apartment.scss';

const Flickity = global.window ? require('react-flickity-component')(React) : 'div';

const flickityOptions = {  
  initialIndex: 2,
  cellAlign: 'left',
  wrapAround: true,
  rightToLeft: true,
  pageDots: false
};

@observer(['appStore', 'appProviders'])
class Apartment extends Component {
  static behindHeader = true;

  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadFullListingDetails(this.props.apartmentId);
  }

  renderImageGallery(apartment) {
    return (

      <header className="apt-header">
        <div className="container-fluid">
          <div className="row">
            <Flickity options={flickityOptions} >
              {apartment.images.map((image, index) => 
                <img key={index} src={image.url.replace('upload','upload/h_500')}/>
              )}
            </Flickity>
          </div>
        </div>
      </header>
    );
  }

  renderInfoBox(title, svgName) {
    return (
      <li className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
        <a href="">
          <svg><use xlinkHref={svgIcons + '_' + svgName} /></svg>
          <div>{title}</div>
        </a>
      </li>
    );
  }

  getFloorLabel(apartment) {
    let label = 'קומה ' + apartment.floor;
    if (apartment.building.floors) { label += '/' + apartment.building.floors; }
    if (apartment.building.elevator) { label += ' + מעלית'; }
    return label;
  }

  renderListingDescription(listing) {
    return (
      <div className="container-fluid apt-info-container">
        <div className="container">
          <div className="col-lg-9">
            <div className="row property-desc">
              <div className="col-md-2">
                <h5>תאור הנכס</h5>
              </div>
              <div className="col-md-10">
                <p>{listing.description}</p>
              </div>
            </div>
            <ApartmentAmenities listing={listing} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    // TODO : mixup between listing and apartment here !!!
    const listing = this.props.appStore.listingStore.listingsById.get(this.props.apartmentId);

    if (!listing || !listing.apartment) {
      return (<div><h4>Loading...</h4></div>);  
    }

    const title = listing.title || `דירת ${listing.apartment.rooms} חד׳ ברח׳ ${listing.apartment.building.street_name}`;
    
    return (
      <div>
        {this.renderImageGallery(listing)}
        <OHEList listing={listing} oheId={this.props.oheId} action={this.props.action} />
        <div className="container-fluid apt-headline-container">
          <div className="container">
            <div className="row">
              <div className="col-md-9">
                <h2>{title}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid apt-highlights-container">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                <ul className="row">
                  {this.renderInfoBox(listing.apartment.building.street_name + ', ' + listing.apartment.building.city.city_name, 'dorbel_icon_location')}
                  {this.renderInfoBox(listing.apartment.rooms + ' חדרים', 'dorbel_icon_bed')}
                  {this.renderInfoBox(listing.apartment.size + ' מ"ר', 'dorbel_icon_ruler')}
                  {this.renderInfoBox(this.getFloorLabel(listing.apartment), 'dorbel_icon_stairs')}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {this.renderListingDescription(listing)}
      </div>
    );
  }
}

Apartment.wrappedComponent.propTypes = {
  apartmentId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  oheId: React.PropTypes.string,
  action: React.PropTypes.string
};

export default Apartment;

