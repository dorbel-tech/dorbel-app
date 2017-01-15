import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Checkbox, Col, DropdownButton, Grid, MenuItem, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import Nouislider from 'react-nouislider';
import _ from 'lodash';

import './Apartments.scss';

const DEFAULT_FILTER_PARAMS = {
  cityId: -1, // City selector default value.
  roomate: true, // Roommate search checkbox default value.
  empty: true, // Empty apartment for roommates checkbox default value.
  room: true, // Roomate looking for roommate/s checkbox default value.
  mrs: 1000, // Monthly rent slider start default value.
  mre: 7000, // Monthly rent slider end default value.
  minRooms: 1, // Rooms number slider start default value.
  maxRooms: 5, // Rooms number slider end default value.
  minSize: 26, // Apartment size slider start default value.
  maxSize: 120, // Apartment size slider end default value.
  ac: false, // Apartment with air conditioning checkbox default value.
  balc: false, // Apartment with balcony checkbox default value.
  elev: false, // Apartment with elevator checkbox default value.
  park: false, // Apartment with parking checkbox default value.
  pet: false // Apartment allowing pets checkbox default value.
};

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = Object.assign({}, DEFAULT_FILTER_PARAMS);

    this.filterObj = { city: DEFAULT_FILTER_PARAMS.cityId };

    this.cities = [];
  }

  componentDidMount() {
    this.props.appProviders.cityProvider.loadCities();
  }

  citySelectHandler(cityId) {
    this.setState({ cityId: cityId });

    this.filterObj.city = cityId;
    this.reloadApartments();
  }

  mrSliderChangeHandler(mrStringArray, unused, monthly_rent) {
    this.sliderChangeHandler(monthly_rent, 'mrs', 'mre');
  }

  roomsSliderChangeHandler(roomsStringArray, unused, rooms) {
    this.sliderChangeHandler(rooms, 'minRooms', 'maxRooms');
  }

  sizeSliderChangeHandler(sizeStringArray, unused, sizes) {
    this.sliderChangeHandler(sizes, 'minSize', 'maxSize');
  }

  sliderChangeHandler(range, minProp, maxProp) {
    let stateChangesObj = {};
    stateChangesObj[minProp] = range[0];
    stateChangesObj[maxProp] = range[1];
    this.setState(stateChangesObj);

    if (range !== [DEFAULT_FILTER_PARAMS[minProp], DEFAULT_FILTER_PARAMS[maxProp]]) {
      this.filterObj[minProp] = range[0] === DEFAULT_FILTER_PARAMS[minProp] ?
        undefined : range[0];
      this.filterObj[maxProp] = range[1] === DEFAULT_FILTER_PARAMS[maxProp] ?
        undefined : range[1];
    } else {
      this.filterObj[minProp] = undefined;
      this.filterObj[maxProp] = undefined;
    }

    this.reloadApartments();
  }

  amenitiesChangeHandler(e) {
    let stateChangesObj = {};
    stateChangesObj[e.target.name] = e.target.checked;
    this.setState(stateChangesObj);

    this.filterObj[e.target.name] = e.target.checked ? true : undefined;
    this.reloadApartments();
  }

  roomateChangeHandler(e) {
    let stateChangesObj = {};
    stateChangesObj[e.target.name] = e.target.checked;
    this.setState(stateChangesObj);

    this.filterObj.room = undefined;
    this.filterObj.rs = undefined;
    // We can't check the newly set state to be false directly,
    // so we do a positive check.
    if (e.target.name === 'roomate' && this.state.roomate) {
      this.filterObj.room = 0;
    } else if (e.target.name === 'room' && this.state.room) {
      this.filterObj.room = 0;
    } else if (e.target.name === 'empty' && this.state.empty) {
      this.filterObj.rs = 0;
    }

    this.reloadApartments();
  }

  reloadApartments() {
    if (this.filterObj.city === DEFAULT_FILTER_PARAMS.cityId) {
      return;
    }

    this.props.appProviders.apartmentsProvider.loadApartments(this.filterObj);
  }

  render() {
    const { listingStore, cityStore } = this.props.appStore;

    if (cityStore.cities.length) {
      this.cities = cityStore.cities;
    }

    const city = this.cities.find(c => c.id === this.state.cityId);
    this.cityTitle = city ? city.city_name : 'טוען...';

    const apartments = listingStore.apartments.length ? listingStore.apartments : [];

    return (
      <Grid fluid>
        <Row className="apartments-container">
          <Col lg={3} md={4} className="search-widget-wrapper">
            <Row className="search-widget-container">
              <Col xs={12} sm={10} smOffset={1}>
                <div className="city-picker">
                  <DropdownButton id="cityDropdown" bsSize="large"
                    title={'עיר: ' + this.cityTitle}
                    onSelect={this.citySelectHandler}>
                    {this.cities.map(city => <MenuItem key={city.id} eventKey={city.id}>{city.city_name}</MenuItem>)}
                  </DropdownButton>
                  <i data-toggle="modal" data-target="#modal-city-promise">i</i>
                </div>
              </Col>
            </Row>
            <Row className="search-switches-container">
              <Col xs={12}>
                <Checkbox name="roomate" checked={this.state.roomate} onChange={this.roomateChangeHandler}>
                  הציגו לי דירות לשותפים
                </Checkbox>
              </Col>
              <Col xs={6}>
                <Checkbox name="empty"
                  checked={this.state.empty}
                  disabled={!this.state.roomate || !this.state.room}
                  onChange={this.roomateChangeHandler}>
                  דירות ריקות לשותפים
                </Checkbox>
              </Col>
              <Col xs={6}>
                <Checkbox name="room"
                  checked={this.state.room}
                  disabled={!this.state.roomate || !this.state.empty}
                  onChange={this.roomateChangeHandler}>
                  חדר בדירת שותפים
                </Checkbox>
              </Col>
            </Row>
            <Row className="search-widget-container">
              <Col xs={10} xsOffset={1} className="cost-slider">
                <h5 className="text-center">בחר טווח מחירים</h5>
                <Nouislider onChange={this.mrSliderChangeHandler}
                  range={{
                    min: DEFAULT_FILTER_PARAMS.mrs,
                    max: DEFAULT_FILTER_PARAMS.mre
                  }}
                  start={[this.state.mrs, this.state.mre]}
                  step={DEFAULT_FILTER_PARAMS.mrs}
                  pips={{ mode: 'steps', density: 30 }}
                  connect={true}
                  direction={'ltr'} />
              </Col>
              <Col xs={10} xsOffset={1} className="roomsnum-slider">
                <h5 className="text-center">בחר מספר חדרים</h5>
                <Nouislider onChange={this.roomsSliderChangeHandler}
                  range={{
                    min: DEFAULT_FILTER_PARAMS.minRooms,
                    '12.5%': 1.5,
                    '25%': 2,
                    '37.5%': 2.5,
                    '50%': 3,
                    '62.5%': 3.5,
                    '75%': 4,
                    '87.5%': 4.5,
                    max: DEFAULT_FILTER_PARAMS.maxRooms
                  }}
                  start={[this.state.minRooms, this.state.maxRooms]}
                  snap={true}
                  pips={{
                    mode: 'values',
                    values: _.range(DEFAULT_FILTER_PARAMS.minRooms,
                      DEFAULT_FILTER_PARAMS.maxRooms + 1),
                    density: 30
                  }}
                  connect={true}
                  direction={'ltr'} />
              </Col>
              <Col xs={10} xsOffset={1} className="size-slider">
                <h5 className="text-center">בחר גודל נכס (במ"ר)</h5>
                <Nouislider onChange={this.sizeSliderChangeHandler}
                  range={{
                    min: DEFAULT_FILTER_PARAMS.minSize,
                    '20%': 40,
                    '40%': 60,
                    '60%': 80,
                    '80%': 100,
                    max: DEFAULT_FILTER_PARAMS.maxSize
                  }}
                  start={[this.state.minSize, this.state.maxSize]}
                  snap={true}
                  pips={{ mode: 'steps', density: 30 }}
                  connect={true}
                  direction={'ltr'} />
              </Col>
            </Row>
            <Row className="search-amenities-container">
              <Col xs={12}>
                <h5 className="text-center"><b>צמצמו את החיפוש</b></h5>
                <Col xs={4}>
                  <Checkbox name="park" checked={this.state.park} onChange={this.amenitiesChangeHandler}>
                    חניה
                  </Checkbox>
                  <Checkbox name="balc" checked={this.state.balc} onChange={this.amenitiesChangeHandler}>
                    מרפסת
                  </Checkbox>
                </Col>
                <Col xs={4}>
                  <Checkbox name="ac" checked={this.state.ac} onChange={this.amenitiesChangeHandler}>
                    מזגן
                  </Checkbox>
                  <Checkbox name="ele" checked={this.state.ele} onChange={this.amenitiesChangeHandler}>
                    מעלית
                  </Checkbox>
                </Col>
                <Col xs={4}>
                  <Checkbox name="pet" checked={this.state.pet} onChange={this.amenitiesChangeHandler}>
                    מותר בע״ח
                  </Checkbox>
                  <Checkbox name="sb" checked={this.state.sb} onChange={this.amenitiesChangeHandler}>
                    סורגים
                  </Checkbox>
                </Col>
              </Col>
            </Row>
          </Col>
          <Col lg={9} md={8} className="search-results-wrapper">
            {apartments.length > 0 ?
              <Row className="search-results-container-list">
                {apartments.map(listing => <ListingThumbnail listing={listing} key={listing.id} />)}
              </Row>
              :
              <div className="search-results-not-found">הלוואי והייתה לנו דירה בדיוק כזו.<br />
                כנראה שהייתם ספציפיים מדי - לא נמצאו דירות לחיפוש זה.<br />
                נסו לשנות את הגדרות החיפוש</div>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

Apartments.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Apartments;
