import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Row } from 'react-bootstrap';
import svgIcons from '~/assets/images/images.sprite.svg';
import ApartmentAmenities from './ApartmentAmenities.jsx';
import OHEList from './OHEList.jsx';
import ListingMenu from './ListingMenu.jsx';
import OHEManager from '~/components/OHEManager/OHEManager';
import ApartmentLocation from '../MapWrapper/MapWrapper.jsx';
import RelatedListings from '../RelatedListings/RelatedListings.jsx';
import ListingBadge from '../ListingBadge/ListingBadge';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Apartment.scss';

const Flickity = global.window ? require('react-flickity-component')(React) : 'div';

const flickityOptions = {
  cellAlign: 'left',
  contain: true,
  pageDots: false
};

@observer(['appStore', 'appProviders', 'router'])
class Apartment extends Component {
  static behindHeader = true;

  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    autobind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.apartmentId != nextProps.apartmentId) {
      this.props = nextProps;
      this.loadFullListingDetails();
    }
  }

  componentWillMount() {
    this.loadFullListingDetails();
  }

  loadFullListingDetails() {
    let listingId = this.props.apartmentId;
    if (!this.props.appStore.listingStore.listingsById.get(listingId)) {
      this.setState({ isLoading: true });
      this.props.appProviders.apartmentsProvider.loadFullListingDetails(listingId)
        .then(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  renderImageGallery(apartment) {
    flickityOptions.initialIndex = apartment.images.length;

    return (
      <header className="apt-header">
        <div className="container-fluid">
          <div className="row">
            <ListingBadge listing={apartment} />
            <Flickity classname="carousel" options={flickityOptions} >
              {apartment.images.map((image, index) =>
                <div key={index} className="sliderBoxes">
                  <img src={image.url.replace('upload', 'upload/h_500')} />
                </div>
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

  renderListingLocation(geolocation) {
    if (geolocation) {
      return (
        <Row>
          <ApartmentLocation geo={geolocation} />
        </Row>
      );
    }
  }

  renderRelatedListings(listingId) {
    return (
      <RelatedListings listingId={listingId} />
    );
  }

  render() {
    // TODO : mixup between listing and apartment here !!!
    const { appStore, action } = this.props;
    const listing = appStore.listingStore.listingsById.get(this.props.apartmentId);

    if (this.state.isLoading) {
      return (
        <div className="loaderContainer">
          <LoadingSpinner/>
        </div>
      );
    }

    const title = listing.title || `דירת ${listing.apartment.rooms} חד׳ ברח׳ ${listing.apartment.building.street_name}`;

    let tabContent;
    switch (action) {
      case 'events':
        tabContent = (<OHEManager listing={listing} />);
        break;
      default:
        // TODO : move to a different file
        tabContent = (
          <div>
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
            {this.renderListingLocation(listing.apartment.building.geolocation)}
            {this.renderRelatedListings(listing.id)}
          </div>
        );
    }

    return (
      <div>
        {this.renderImageGallery(listing)}
        <ListingMenu listing={listing} currentAction={action} />
        {tabContent}
      </div>
    );
  }
}


Apartment.wrappedComponent.propTypes = {
  apartmentId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object,
  oheId: React.PropTypes.string,
  action: React.PropTypes.string
};

export default Apartment;
