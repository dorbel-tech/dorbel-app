import React, { Component } from 'react';
import { Checkbox, Col, Grid, MenuItem, Row, SplitButton } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import Nouislider from 'react-nouislider';
import _ from 'lodash';

import './Apartments.scss';

const DEFAULT_FILTER_PARAMS = {
  cityId: -1,
  mrs: 1000,
  mre: 7000,
  minRooms: 1,
  maxRooms: 5
};

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, DEFAULT_FILTER_PARAMS);

    this.filterObj = {city: DEFAULT_FILTER_PARAMS.cityId};

    this.cities = [];

    this.citySelectHandler = this.citySelectHandler.bind(this);
    this.mrSliderChangeHandler = this.mrSliderChangeHandler.bind(this);
    this.roomsSliderChangeHandler = this.roomsSliderChangeHandler.bind(this);
  }

  componentDidMount() {
    this.props.appProviders.cityProvider.loadCities();
  }

  citySelectHandler(cityId) {
    this.setState({cityId: cityId});
    
    this.filterObj.city = cityId;
    this.reloadApartments();
  }

  mrSliderChangeHandler(mrStringArray, unused, monthly_rent) {
    this.setState({mrs: monthly_rent[0], mre: monthly_rent[1]});

    if (monthly_rent !== [DEFAULT_FILTER_PARAMS.mrs, DEFAULT_FILTER_PARAMS.mre]) {
      this.filterObj.mrs = monthly_rent[0] === DEFAULT_FILTER_PARAMS.mrs ?
        undefined : monthly_rent[0];
      this.filterObj.mre = monthly_rent[1] === DEFAULT_FILTER_PARAMS.mre ?
        undefined : monthly_rent[1];
    } else {
      this.filterObj.mrs = undefined;
      this.filterObj.mre = undefined;
    }
    this.reloadApartments();
  }

  roomsSliderChangeHandler(roomsStringArray, unused, rooms) {
    this.setState({minRooms: rooms[0], maxRooms: rooms[1]});

    if (rooms !== [DEFAULT_FILTER_PARAMS.mrs, DEFAULT_FILTER_PARAMS.mre]) {
      this.filterObj.minRooms = rooms[0] === DEFAULT_FILTER_PARAMS.minRooms ?
        undefined : rooms[0];
      this.filterObj.maxRooms = rooms[1] === DEFAULT_FILTER_PARAMS.maxRooms ?
        undefined : rooms[1];
    } else {
      this.filterObj.minRooms = undefined;
      this.filterObj.maxRooms = undefined;
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
                  <SplitButton id="cityDropdown" bsSize="large"
                    title={'עיר: ' + this.cityTitle}
                    onSelect={this.citySelectHandler}>
                    {this.cities.map(city => <MenuItem key={city.id} eventKey={city.id}>{city.city_name}</MenuItem>)}
                  </SplitButton>
                  <i data-toggle="modal" data-target="#modal-city-promise">i</i>
                </div>
              </Col>
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
                <h5 className="text-center">בחר גודל נכס (מ״ר)</h5>
                <Nouislider range={{ min: 26, '20%': 40, '40%': 60, '60%': 80, '80%': 100, max: 120 }}
                  start={[26, 120]}
                  snap={true}
                  pips={{ mode: 'steps', density: 30 }}
                  connect={true}
                  direction={'ltr'} />
              </Col>
            </Row>
            <Row className="search-switches-container text-center">
              <Col xs={6}>
                <Checkbox>
                  דירות ריקות
                </Checkbox>
              </Col>
              <Col xs={6}>
                <Checkbox>
                  דירות שותפים
                </Checkbox>
              </Col>
            </Row>
            <Row className="search-amenities-container">
              <Col xs={10} xsOffset={1}>
                <h5 className="text-center"><b>צמצמו את החיפוש:</b></h5>
                <Col xs={4}>
                  <Checkbox>
                    חניה
                  </Checkbox>
                  <Checkbox>
                    מרפסת
                  </Checkbox>
                </Col>
                <Col xs={4}>
                  <Checkbox>
                    מרוהטת
                  </Checkbox>
                  <Checkbox>
                    בע״ח
                  </Checkbox>
                </Col>
                <Col xs={4}>
                  <Checkbox>
                    גינה
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
              <h1 className="search-results-not-found">לא נמצאו תוצאות</h1>
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
