import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { observer } from 'mobx-react';
import svgIcons from '~/assets/images/images.sprite.svg';
import ApartmentAmenities from './ApartmentAmenities.jsx';
import OHEList from './OHEList.jsx';
import './Apartment.scss';

const Flickity = global.window ? require('react-flickity-component')(React) : 'div';

const flickityOptions = {
  cellAlign: 'left',
  wrapAround: true,
  rightToLeft: true,
  pageDots: false
};

const tabs = [
  { eventKey: 'publishing', title: 'פרסום' },
  { eventKey: 'open_house_events', title: 'מועדי ביקור' }
];

@observer(['appStore', 'appProviders'])
class Apartment extends Component {
  static behindHeader = true;

  constructor(props) {
    super(props);
    this.state = { activeTab: tabs[0].eventKey };
    this.changeTab = this.changeTab.bind(this);
  }
  

  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadSingleApartment(this.props.apartmentId);
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

  renderListingMenu(listing) {
    const { authStore } = this.props.appStore;
    const profile = authStore.getProfile();     
    if (listing.publishing_user_id === profile.dorbel_user_id) {
      return (
        <Nav bsStyle="tabs" activeKey={tabs[0].eventKey} onSelect={this.changeTab}>
          {tabs.map(tab => <NavItem key={tab.eventKey} eventKey={tab.eventKey}>{tab.title}</NavItem>)}
        </Nav>
      );
    } else {
      return null;
    }
  }

  changeTab(tabKey) {
    this.setState({ activeTab: tabKey });
  }

  render() {
    // TODO : mixup between listing and apartment here !!!
    const listing = this.props.appStore.apartmentStore.apartmentsById.get(this.props.apartmentId);

    if (!listing) {
      return (<div><h4>Loading...</h4></div>);  
    }

    const title = listing.title || `דירת ${listing.apartment.rooms} חד׳ ברח׳ ${listing.apartment.building.street_name}`;

    let tabContent;
    switch (this.state.activeTab) {
      case 'open_house_events' : 
        tabContent = (<div>WOW so many events</div>);
        break;
      case 'publishing' :
      default: 
        tabContent = this.renderListingDescription(listing);
    }
    
    return (
      <div>
        {this.renderImageGallery(listing)}
        <OHEList listing={listing} />
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
        {this.renderListingMenu(listing)}
        {tabContent}
      </div>
    );
  }
}

Apartment.wrappedComponent.propTypes = {
  apartmentId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object
};

export default Apartment;

