import React, { Component } from 'react';
import { Col, Grid, MenuItem, Row, SplitButton } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import NavLink from '~/components/NavLink';
import Nouislider from 'react-nouislider';

import './Apartments.scss';

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadApartments();
    this.props.appProviders.cityProvider.loadCities();
  }

  render() {
    const { listingStore, cityStore } = this.props.appStore;
    const apartments = listingStore.apartments.length ? listingStore.apartments : [];
    const cities = cityStore.cities.length ? cityStore.cities : [{city_id: 0, city_name: 'טוען...'}];
    // TODO: Set selectedCity in the non default case.
    const selectedCity = cities[0];

    return (
    <Grid fluid>
      <Row>
        <Col lg={3} md={4} className="search-widget-wrapper">
          <Row className="search-widget-container">
            <Col xs={12} sm={10} smOffset={1}>
              <div className="city-picker">
                <SplitButton id="cityDropdown" bsSize="large" title={"עיר: " + selectedCity.city_name}>
                  {cities.map(city => <MenuItem key={city.id} eventKey={city.id}>{city.city_name}</MenuItem>)}
                </SplitButton>
                <i data-toggle="modal" data-target="#modal-city-promise">i</i>
              </div>
            </Col>
            <Col xs={10} xsOffset={1} className="cost-slider">
              <h5 className="text-center">בחר טווח מחירים</h5>
              <Nouislider id="costRange"
                          range={{min: 0, max: 12000}}
                          start={[0, 12000]}
                          step={2000}
                          pips={{mode: 'steps', density: 30}}
                          connect={true}
                          direction={"ltr"}/>
            </Col>
            <Col xs={10} xsOffset={1} className="roomsnum-slider">
              <h5 className="text-center">בחר מספר חדרים</h5>
              <div id="roomsRange"></div>
            </Col>
            <Col xs={10} xsOffset={1} className="size-slider">
              <h5 className="text-center">בחר גודל נכס (מ״ר)</h5>
              <div id="sizeRange"></div>
            </Col>
          </Row>
          <Row className="search-switches-container text-center">
            <Col xs={6}>
              <label>דירות ריקות</label>
              <input type="checkbox" name="entire-apt-switch"/>
            </Col>
            <Col xs={6}>
              <label> דירות שותפים</label>
              <input type="checkbox" name="roomates-apt-switch"/>
            </Col>
          </Row>
          <Row className="search-amenities-container">
            <Col xs={10} xsOffset={1}>
              <h5 className="text-center"><b>צמצמו את החיפוש:</b></h5>
              <Col xs={4}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/>חניה
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/> מזגן
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/> מרפסת
                  </label>
                </div>
              </Col>
              <Col xs={4}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/>מרוהטת
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/> מזגן
                  </label>
                </div>
                <div className="checkbox disabled">
                  <label>
                    <input type="checkbox" value="" disabled/> ממ״ד
                  </label>
                </div>
              </Col>
              <Col xs={4}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/>גינה
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/> מחסן
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" value=""/> בע״ח
                  </label>
                </div>
              </Col>
            </Col>
          </Row>
        </Col>
        <Col lg={9} md={8} className="search-results-wrapper">
          <Row className="search-results-container-list">
            {apartments.map(listing => <ListingThumbnail listing={listing} key={listing.id} />)}
          </Row>
        </Col>
      </Row>
    </Grid>
    );
  }
}

Apartments.wrappedComponent.propTypes = {
  children: React.PropTypes.node,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Apartments;
