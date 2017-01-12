import React, { Component } from 'react';
import { Checkbox, Col, Grid, MenuItem, Row, SplitButton } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import Nouislider from 'react-nouislider';

import './Apartments.scss';

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  constructor(props) {
    super(props);
    this.filterParams = {
      cityId: -1,
      mrs: 1000,
      mre: 7000
    };

    this.cities = [];

    this.citySelectHandler = this.citySelectHandler.bind(this);
    this.mrSliderChangeHandler = this.mrSliderChangeHandler.bind(this);
  }
  
  componentDidMount() {
    this.props.appProviders.cityProvider.loadCities();
  }

  citySelectHandler(cityId) {
    this.filterParams.cityId = cityId;
    this.reloadApartments();
  }

  mrSliderChangeHandler(mrStringArray, unused, monthly_rent) {
    this.filterParams.mrs = monthly_rent[0];
    this.filterParams.mre = monthly_rent[1];
    this.reloadApartments();
  }

  reloadApartments() {
    if (this.filterParams.cityId === -1) {
      this.filterParams.cityId = this.cities[0].id;
    }
    let filterObj = {city: this.filterParams.cityId};
    if (this.filterParams.monthly_rent !== [1000, 7000]) {
      filterObj.mrs = this.filterParams.mrs === 1000 ? undefined : this.filterParams.mrs;
      filterObj.mre = this.filterParams.mre === 7000 ? undefined : this.filterParams.mre;
    }

    this.props.appProviders.apartmentsProvider.loadApartments(filterObj);
  }

  render() {
    const { listingStore, cityStore } = this.props.appStore;
    
    if (cityStore.cities.length) {
      this.cities = cityStore.cities;
      //this.reloadApartments();
    }

    const city = this.cities.find(c => c.id === this.filterParams.cityId);
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
                <Nouislider range={{ min: 1000, max: 7000 }}
                  start={[this.filterParams.mrs, this.filterParams.mre]}
                  step={1000}
                  pips={{ mode: 'steps', density: 30 }}
                  connect={true}
                  direction={'ltr'}
                  onChange={this.mrSliderChangeHandler} />
              </Col>
              <Col xs={10} xsOffset={1} className="roomsnum-slider">
                <h5 className="text-center">בחר מספר חדרים</h5>
                <Nouislider range={{
                  min: 1,
                  '12.5%': 1.5,
                  '25%': 2,
                  '37.5%': 2.5,
                  '50%': 3,
                  '62.5%': 3.5,
                  '75%': 4,
                  '87.5%': 4.5,
                  max: 5
                }}
                  start={[1, 5]}
                  // format={{
                  //   to: function (value) {
                  //     return value + ',-';
                  //   },
                  //   from: function (value) {
                  //     return value.replace(',-', '');
                  //   }
                  // }}
                  snap={true}
                  pips={{ mode: 'values', values: [1, 2, 3, 4, 5], density: 30 }}
                  connect={true}
                  direction={'ltr'} />
              </Col>
              <Col xs={10} xsOffset={1} className="size-slider">
                <h5 className="text-center">בחר גודל נכס (מ״ר)</h5>
                <Nouislider range={{ min: 27, '20%': 40, '40%': 60, '60%': 80, '80%': 100, max: 120 }}
                  start={[27, 120]}
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
