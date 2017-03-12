import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Grid, Row } from 'react-bootstrap';
import ApartmentAmenities from './ApartmentAmenities.jsx';
import OHEList from './OHEList.jsx';
import ListingMenu from './ListingMenu.jsx';
import ListingHeader from './ListingHeader.jsx';
import OHEManager from '~/components/OHEManager/OHEManager';
import ApartmentLocation from '../MapWrapper/MapWrapper.jsx';
import RelatedListings from '../RelatedListings/RelatedListings.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import utils from '../../providers/utils';
import './Listing.scss';

@observer(['appStore', 'appProviders', 'router'])
class Listing extends Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    autobind(this);
  }

  static serverPreRender(props) {
    return props.appProviders.listingsProvider.loadFullListingDetails(props.listingId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listingId != nextProps.listingId) {
      this.props = nextProps;
      this.loadFullListingDetails();
    }
  }

  componentWillMount() {
    this.loadFullListingDetails();
  }

  loadFullListingDetails() {
    let listingId = this.props.listingId;
    if (!this.props.appStore.listingStore.get(listingId)) {
      this.setState({ isLoading: true });
      this.props.appProviders.listingsProvider.loadFullListingDetails(listingId)
        .then(() => this.setState({ isLoading: false }));
    }
  }

  renderInfoBox(title, svgName) {
    // TODO : use Icon component
    return (
      <li className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
        <svg><use xlinkHref={'#' + svgName} /></svg>
        <div>{title}</div>
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
                <h5>תאריך כניסה</h5>
              </div>
              <div className="col-md-10">
                <p>{this.props.appProviders.utils.formatDate(listing.lease_start)}</p>
              </div>
            </div>
            <div className="row property-desc">
              <div className="col-md-2">
                <h5>תאור הנכס</h5>
              </div>
              <div className="col-md-10">
                <p>{listing.description}</p>
              </div>
            </div>
            <ApartmentAmenities listing={listing} />
            <div className="row property-desc">
              <div className="col-md-2">
                <h5>פרטי תשלום</h5>
              </div>
              <div className="col-md-10">
                <p>ארנונה: {listing.property_tax}</p>
                <p>ועד הבית: {listing.board_fee}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderListingLocation(geolocation) {
    if (geolocation) {
      return (
        <Grid fluid className="location-container">
          <Row >
            <ApartmentLocation geo={geolocation} />
          </Row>
        </Grid>
      );
    }
  }

  renderRelatedListings(listingId) {
    return (
      <RelatedListings listingId={listingId} />
    );
  }

  render() {
    const { appStore, action } = this.props;
    const listing = appStore.listingStore.get(this.props.listingId);

    if (this.state.isLoading) {
      return (
        <div className="loaderContainer">
          <LoadingSpinner />
        </div>
      );
    }

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
                    <h2>{utils.getListingTitle(listing)}</h2>
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
        <ListingHeader listing={listing} />
        <ListingMenu listing={listing} currentAction={action} />
        {tabContent}
      </div>
    );
  }
}


Listing.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object,
  oheId: React.PropTypes.string,
  action: React.PropTypes.string
};

export default Listing;
